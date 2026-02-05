# Media Manager - High Level Requirements

## System Overview

A GUI based web application (intended for local network traffic only) to manage Jellyfin media. The main problem this is trying to solve is the creating symlinks from an unstructure source directory to a Jellyfin-friendly folder structure.

## Process flow

1. User scans the source media directory
    - POSTs on `/api/v1/scans`
2. A "file explorer"-like UI shows all Jellyfin relevant media files (video, audio, subtitle files)
    - GETs `MediaFile`s for the source media directory via `/api/v1/media-files`.
4. A "file explorer"-like UI shows all desired Jellyfin content (shows, movies)
    - GETs `Content` represeting all shows and movies via `/api/v1/content`
5. User links the relevant media files to content by either drag-and-drop or selecting an item from each "file exporer"-like UI and click a link button
    - Where possible, the scan should create and link content to scanned media files by inferring from the filename
    - POSTs `MediaFileLink` to `/api/v1/content/{contentId}/media-files. Symlink should be created at this point.

## Media file scanning

- `MediaFile`s in a source directory are scanned into the system via:
    - watching for file changes
    - user triggered
- On additional rescan, previously scanned files are updated, new files are added and missing files are removed.
- Each media file is assigned a UUIDv7

## Content management

- CRUD operations on TV Show and Movie content
- A TV Show can have many seasons, a season can have many episodes, and an episode can have many media-files. A movie can have many media-files
    - `Show` and `Season` are just groups and cannot contain media-files. Only `Episode` and `Movie` can contain media-files.
- Each type of content is assigned a UUIDv7

## Linking content and media files

- A `MediaFile` can be linked with content `Episode` and `Movie`
- Once a link is established between the two, a symlink of that media is created in the Jellyfin folder
- If a link is broken, or source media file is no longer available, the symlink should be broken

# API Design

## Proposed API Endpoints
```
POST    /api/v1/scans                                       # Trigger a scan

GET     /api/v1/media-files                                 # Get all currently scanned media files
GET     /api/v1/media-files/{id}                            # Get scanned media file with {id}

GET     /api/v1/shows                                       # Get all shows
GET     /api/v1/shows/{id}                                  # Get show content with {id}
POST    /api/v1/shows                                       # Create new show
PATCH   /api/v1/shows/{id}                                  # Update show
DELETE  /api/v1/shows/{id}                                  # Delete show by id

GET     /api/v1/seasons                                     # Get all seasons
GET     /api/v1/seasons/{id}                                # Get season content with {id}
POST    /api/v1/seasons                                     # Create new season
PATCH   /api/v1/seasons/{id}                                # Update season
DELETE  /api/v1/seasons/{id}                                # Delete season by id

GET     /api/v1/episodes                                    # Get all episodes
GET     /api/v1/episodes/{id}                               # Get episode by id
POST    /api/v1/episodes                                    # Create new episode
PATCH   /api/v1/episodes/{id}                               # Update episode
DELETE  /api/v1/episodes/{id}                               # Delete episode by id

GET     /api/v1/movies                                      # Get all movies
GET     /api/v1/movies/{id}                                 # Get movie by id
POST    /api/v1/movies                                      # Create new movie
PATCH   /api/v1/movies/{id}                                 # Update movie
DELETE  /api/v1/movies/{id}                                 # Delete movie by id

GET     /api/v1/episodes/{id}/media-files                   # Get media files linked to episode
POST    /api/v1/episodes/{id}/media-files                   # Link media file to episode
DELETE  /api/v1/episodes/{id}/media-files/{id}              # Delete media file link to episode

GET     /api/v1/movies/{id}/media-files                     # Get media files linked to movie
POST    /api/v1/movies/{id}/media-files                     # Link media file to movie
DELETE  /api/v1/movies/{id}/media-files/{id}                # Delete media file link to movie

GET     /api/v1/shows/{showId}/seasons                      # Get all seasons for show
GET     /api/v1/shows/{showId}/seasons/{seasonId}/episodes  # Get all episodes for show
```

# Technology Stack

- React GUI web app
- NodeJS daemon
    - Express to serve React web app and API
    - Interacts with the filesystem
    - SQLite database to store media-file and content data
