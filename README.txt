SOULS GATE - DARK SOULS III MUSIC ARCHIVE

INSTALL
1. Extract this ZIP.
2. Copy all three files (install-music.ps1, MusicArchive.tsx, music-hero.png) to:
   C:\Users\hack0\souls-gate
   (the same folder that contains package.json)
3. Open PowerShell in the project root and run:
   powershell -ExecutionPolicy Bypass -File .\install-music.ps1
4. Run:
   npm.cmd run build

The installer makes a timestamped backup of app/games/dark-souls-3/page.tsx.

AUDIO STORAGE
The component expects a PUBLIC Supabase Storage bucket named:
   game-assets
and this folder:
   ds3/music

Upload all 45 files from:
   app/games/dark-souls-3/song
to:
   game-assets/ds3/music

Keep every original filename exactly as it is. Do not rename the files.
The first track is expected to be:
   1-01 Dark Souls III.mp3
The remaining tracks are expected to use the filenames shown in the Windows folder screenshot and the component's track list.

ENVIRONMENT
The component uses:
   NEXT_PUBLIC_SUPABASE_URL
Make sure this variable exists in .env.local and points to your Supabase project.
The bucket must be public for the public object URLs used by the player.

NOTES
- The original FLAC files remain untouched.
- This archive lists 45 tracks based on the supplied folder screenshot.
- If any filename differs by punctuation, capitalization, or extension, that individual track may not load; preserve exact names or tell us which one fails.
- Public distribution of copyrighted game music may require permission from the rights holder.
