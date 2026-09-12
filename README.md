# AASPI publications — searchable list

A single-page site that reads the AASPI publications spreadsheet in the browser and lets
people search and filter it. Grouped by year, newest first, with filters for type, topic,
and author, and a free-text search across titles, authors, venues, and abstracts.

Files:

```
index.html                 the whole site (HTML, CSS, JS in one file)
data/AASPI_pubs.xlsx       the publication list
```

## Publishing it

1. Create a repository (for example `aaspi-publications`) and put these files at its root.
2. Settings → Pages → Build and deployment → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. The page appears at `https://<user>.github.io/<repo>/`.

No build step and no dependencies to install. The page loads SheetJS from a CDN at
run time to read the spreadsheet.

## Updating the list

Replace `data/AASPI_pubs.xlsx` with a new export. Keep the file name and keep the sheet
named `Complete`; nothing else needs editing. The page also accepts the old name
`data/AASPI_pubs_working_list.xlsx` if that one is present instead.

Columns read from the sheet:

| Column | Used for |
|---|---|
| Title | entry title, search, topic tagging |
| Year | year grouping and the year filter |
| Type | type filter (Crossref-style strings are relabeled, e.g. `proceedings-article` → Expanded abstract) |
| Authors | author filter, search |
| Journal | venue line, search, topic tagging |
| DOI | DOI link and the copied reference |
| URL | what the title links to (falls back to DOI) |
| Abstract | expandable abstract, search, topic tagging |

Other columns in the sheet (Match Status, Match Score, Candidate *, and so on) are ignored,
so the working file can stay as it is.

Entries with no year sit in a group at the bottom and are hidden until the
"Include N without year or type" box in the sidebar is checked. There are 42 of those at the
moment, so that toggle doubles as a worklist of what still needs metadata.

## Topic tags

Tags are not stored in the spreadsheet. They are matched in the browser from title, venue,
and abstract text using the `TOPICS` dictionary near the top of the script in `index.html`,
in three groups: attributes and methods, geology and setting, and region. Each entry is a
label and a regular expression:

```js
['Gas hydrates', /hydrate|\bBSR\b/i],
```

Adding, renaming, or retiring a tag means editing that one line. Counts in the sidebar
update on their own. Where abstracts are missing, tagging works off the title alone, so
coverage will improve as abstracts get filled in.

Author names are matched on surname plus first initial, which merges `H. Bedle` with
`Heather Bedle`. The fullest-spelled variant that appears most often is what shows in the
sidebar.

## Sharing a filtered view

Filters are written into the URL, so a link like

```
.../#q=hydrates&topic=New%20Zealand
```

reopens that search. Useful for pointing sponsors or students at a slice of the list.

## Local preview

Browsers block reading the spreadsheet from a `file://` page, so serve the folder:

```bash
python -m http.server 8000
```

then open `http://localhost:8000`. If the file is opened directly anyway, the page offers a
file picker as a fallback.

## Counting

`index.html` ends with the GoatCounter snippet pointing at `hbedle.goatcounter.com`. Swap it
for the shared `count.js` include if this repo should follow the same pattern as the teaching
repos.

## License

Text and code here: CC BY-SA 4.0. The publications themselves belong to their publishers;
this is a finding aid pointing at them.
