## Technical documentation

# Task 1, Part 2: Storyblok Management API

For this part of the assessment, I used the Storyblok Management API to create a Content Type, create a story using that type, and upload a photo to attach to it.

I used `curl` for the requests and `jq` to inspect the JSON responses.

## 1. Content Type

I used the Storyblok Management API to set up a Content Type called `ollie_journal_entry` for individual journal entries.

The Content Type includes five fields:

| Field | Type |
|---|---|
| `title` | Text |
| `summary` | Textarea |
| `date` | Datetime |
| `cover_image` | Asset |
| `body` | Richtext |

The component is configured with `is_root: true` and `is_nestable: false`, allowing it to be used as the main Content Type for a story.

I verified the configuration using the Management API:

```bash
curl -sS \
  "https://mapi.storyblok.com/v1/spaces/$STORYBLOK_SPACE_ID/components" \
  -H "Authorization: $STORYBLOK_MANAGEMENT_TOKEN" \
  | jq '.components[] | select(.name == "ollie_journal_entry")'
```

The response confirmed the Content Type and its fields.

## 2. Creating the story

I created a draft story called **A Day in the Life of Ollie** using the Management API.

```bash
curl -sS -X POST \
  "https://mapi.storyblok.com/v1/spaces/$STORYBLOK_SPACE_ID/stories" \
  -H "Authorization: $STORYBLOK_MANAGEMENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "story": {
      "name": "A Day in the Life of Ollie",
      "slug": "a-day-in-the-life-of-ollie",
      "content": {
        "component": "ollie_journal_entry",
        "title": "A Day in the Life of Ollie",
        "summary": "Walks, snacks, and an extremely demanding nap schedule.",
        "body": {"type": "doc", "content": []}
      }
    }
  }'
```

The API returned a story ID of `238856900965475` with `published: false`, confirming that the story was created as a draft.

## 3. Uploading the asset

The asset upload required a few more steps than creating the Content Type or story.

Rather than uploading the JPEG directly through the initial Management API request, Storyblok provides signed instructions for uploading the file to storage.

### Requesting the upload

I started by requesting an upload for `IMG_1453.jpeg`.

```bash
curl -sS -X POST \
  "https://mapi.storyblok.com/v1/spaces/$STORYBLOK_SPACE_ID/assets/" \
  -H "Authorization: $STORYBLOK_MANAGEMENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"filename":"IMG_1453.jpeg"}' \
  -o /tmp/ollie-upload.json
```

The response included a `post_url`, a set of signed `fields`, an asset ID, and a public URL.

I saved the response locally because the signed values were needed for the next request. These values are temporary and shouldn't be committed to the repository.

### Uploading the JPEG

Next, I used the returned `post_url` and signed fields to upload the JPEG using a multipart form POST.

The request included the storage permissions, content type, policy, AWS signature fields, and the image file itself.

The important part was using the signed values exactly as returned by the API. The storage request doesn't use the Storyblok Management API token.

The upload returned an empty response body. To verify that the file had actually been uploaded, I requested its `public_url` and received **HTTP 200**.

### Finalizing the upload

After confirming the file was accessible, I called the `finish_upload` endpoint.

```bash
ASSET_ID=$(jq -r '.id' /tmp/ollie-upload.json)

curl -sS \
  "https://mapi.storyblok.com/v1/spaces/$STORYBLOK_SPACE_ID/assets/$ASSET_ID/finish_upload" \
  -H "Authorization: $STORYBLOK_MANAGEMENT_TOKEN"
```

This GET request confirmed the finalized asset, with ID `238857755983320`.

The final image is available at:

https://a.storyblok.com/f/296312371978956/9152b9072b/img_1453.jpeg

The main distinction here is that obtaining an asset ID, uploading the actual file, and finalizing the upload are separate operations. I verified the storage response rather than assuming the first successful request meant the image was ready.

## 4. Attaching the image to the story

Once the asset was available, I updated the existing story using a PUT request to:

`https://mapi.storyblok.com/v1/spaces/{space_id}/stories/238856900965475`

I preserved the existing story content and added the `cover_image` field:

```json
{
  "cover_image": {
    "fieldtype": "asset",
    "id": 238857755983320,
    "filename": "https://a.storyblok.com/f/296312371978956/9152b9072b/img_1453.jpeg"
  }
}
```

I then retrieved the story again through the Management API to confirm that the `cover_image` field referenced the uploaded asset.

Finally, I checked the local website to confirm that the photo rendered correctly in the journal entry.

## 5. Verification and notes

The final result is a draft story using `ollie_journal_entry`, with the JPEG successfully uploaded and attached.

The main issues I encountered were an existing Content Type causing a duplicate-name error and the multi-step asset upload process. Both were resolved by checking the API responses and verifying the resources before proceeding.

I kept the Management API credentials in a local `.env.management` file excluded from Git, separate from the delivery token used by the Next.js application.

## References

- [Create a component](https://www.storyblok.com/docs/api/management/components/create-a-component)
- [Create a story](https://www.storyblok.com/docs/api/management/stories/create-a-story)
- [Upload and replace assets](https://www.storyblok.com/docs/api/management/assets/upload-and-replace-assets)
- [Finish upload](https://www.storyblok.com/docs/api/management/assets/finish-upload)