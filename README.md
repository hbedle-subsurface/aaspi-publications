# AASPI publications

**[hbedle-subsurface.github.io/aaspi-publications](https://hbedle-subsurface.github.io/aaspi-publications/)**

Everything the AASPI consortium has published, in one searchable list: journal papers,
expanded abstracts, magazine columns, preprints, and book chapters. Built for the question
that usually comes up in the middle of a project — has anyone in the group already worked on
this attribute, in this basin?

## Finding things

**Search** covers titles, authors, venues, and abstract text at once. Several words narrow
rather than widen, so `taranaki channel` returns only entries containing both. Matches are
highlighted in the results, including inside abstracts.

**The year chart** at the top is the year filter. Clicking a bar restricts the list to that
year, clicking again releases it, and several years can be on at once. The pale part of each
bar is the full count for that year and the solid part is how much of it survives the filters
currently set, so the chart shows where a topic sits in time: a search for `machine learning`
leaves almost nothing before 2014 and fills the bars after it.

**Type** separates peer-reviewed papers from expanded abstracts, conference abstracts,
magazine columns, and preprints. Peer-reviewed entries carry a crimson label in the list.

**Topic** tags each entry from its title, venue, and abstract, in three groups:

- attributes and methods — coherence, curvature, spectral decomposition, SOM, GTM, PCA and
  ICA, GLCM texture, distance-quadrant, inversion, AVO and anisotropy, and others
- geology and setting — deepwater channels and MTDs, carbonates and reefs, shales, salt and
  volcanics, gas hydrates, CO2 storage, geothermal, induced seismicity, offshore wind
- region — New Zealand, Gulf of Mexico, Brazil, Australia, Oklahoma and the midcontinent,
  the Permian, Alaska, China, the North Sea

Tags combine, so *Deepwater channels* plus *New Zealand* plus *Machine learning* gives the
Taranaki facies work and little else. Every tag printed under an entry is clickable, which
is a quick way to find the neighbors of a paper already in front of you.

**Author** lists everyone in the bibliography, most prolific first, with a find box for the
long tail. `H. Bedle` and `Heather Bedle` count as one person, since names are matched on
surname plus first initial. Author names inside an entry are clickable too.

Each entry gives the title as a link to the DOI or publisher page, an expandable abstract
where one is on file, and **Copy reference** for pasting a formatted citation into a proposal
or an annual report.

## Sharing a view

Filters are written into the address bar, so any search or set of filters is a link:

```
.../#q=hydrates
.../#topic=Geothermal
.../#year=2025,2026&type=Journal%20article
.../#author=lubo-robles|D
```

Useful for sponsor email, a reading list for a new student, or the annual review deck.

## What is and is not in the list

The spreadsheet holds 434 rows. Eight of those are the same paper entered twice, which the
page merges on load (rows sharing a DOI, and a row with no year whose title repeats one
already present), leaving 426 entries. 421 carry a year; the remaining 5 sit in a group at
the bottom, hidden until the *Include 5 without year or type* box in the sidebar is checked.

Abstracts are on file for 329 entries, and those are what search and tagging work best on:
where an abstract is missing, tagging falls back to the title alone, so an older expanded
abstract can carry fewer tags than it deserves.

Entries with no DOI on file link to the AASPI publications page at
`mcee.ou.edu/aaspi/publications.html` instead, and carry a dashed label saying so, so a title
link is never mistaken for a link to the paper itself. Replacing that URL with a real DOI
clears the label automatically.

Cells reading `none` or `MISSING` are treated as empty, so they never become a broken link
or a printed abstract. Publisher HTML in an abstract is stripped, escaped angle brackets are
restored, and a leading "Abstract" or "Summary" is trimmed off.

## Keeping it up to date

Replace `data/AASPI_pubs.xlsx` with a new export, keeping the file name and the sheet named
`Complete`. The file name matters: the page reads `data/AASPI_pubs.xlsx` first and only falls
back to `AASPI_pubs_working_list.xlsx` or `AASPI_pubs_with_additions.xlsx` if that name is
absent, so uploading a new spreadsheet under a different name leaves the old one in charge.
The footer prints which file it read and how many rows came out of it, which is the quickest
way to tell whether an upload took. Nothing else needs editing — the page reads the spreadsheet in the browser, so
the new list is live as soon as Pages rebuilds. Columns used are Title, Year, Type, Authors,
Journal, DOI, URL, and Abstract; everything else in the sheet is ignored, so the working file
can stay as it is.

Topic tags are not stored in the spreadsheet. They come from the `TOPICS` dictionary near the
top of the script in `index.html`, one line per tag:

```js
['Gas hydrates', /hydrate|\bBSR\b/i],
```

Adding, renaming, or retiring a tag means editing that line, and the sidebar counts follow.

## Page counts and what people look for

`count.js` reports to the shared GoatCounter account at `hbedle.goatcounter.com`, the same
one the teaching sites use. GoatCounter records `location.pathname`, so views of this site
arrive under `/aaspi-publications/` and stay separable from the other repos.

It counts three things:

- **page views**, the ordinary GoatCounter hit on load
- **filter and search use**, sent as GoatCounter events under names like
  `aaspi-publications/topic/Geothermal`, `aaspi-publications/year/2024`, and
  `aaspi-publications/author/Heather Bedle`. Opening an abstract and copying a reference
  come through as `aaspi-publications/action/...`. Each name is sent at most once per visit,
  so the Events list on the dashboard reads as *how many people used this topic*, not how
  many times somebody clicked around.

  Typed searches are counted against the same vocabulary rather than recorded verbatim. A
  term is run through the topic patterns and the list of author surnames, so `taranaki`
  arrives as `search/New Zealand`, `som` as `search/Self-organizing maps`, and `lubo-robles`
  as `search/David Lubo-Robles`. Anything that matches nothing arrives as `search/other`,
  which keeps the amount of searching visible without building a list of what people typed.
  Terms are only counted once someone stops typing for two and a half seconds, so partial
  words never register.
- **the view count itself**, read back from GoatCounter and printed as a line in the page
  footer. This one needs *Allow adding visitor counts on your website* switched on in the
  GoatCounter site settings; until it is, the request comes back empty and the footer line
  stays hidden rather than showing an error.

Three flags at the top of `count.js` turn the pieces off independently: `TRACK_FILTERS`,
`TRACK_SEARCHES`, and `SHOW_COUNT`. Every event name is one of the labels defined in this
repo, so the Events list stays about the length of the tag list; GoatCounter sets no cookies
and keeps no IP addresses. Counting is skipped on `file://`, on localhost, and in
`preview.html`.

The matcher lives in `searchVocabHits()` in `index.html`, next to the `TOPICS` dictionary it
draws on, so a new tag widens what searches can be recognized without any other change.

## Previewing without a server

`preview.html` is a standalone copy with the images and the spreadsheet embedded in the file,
for opening straight off a disk or emailing to someone. It is a snapshot: it does not follow
changes to `data/AASPI_pubs.xlsx`, so regenerate it (or just use the live site) after an
update. `index.html` is what Pages serves.

## Credit and license

Compiled by Heather Bedle, School of Geosciences, University of Oklahoma.
CC BY-SA 4.0 for this compilation and the code here; the publications themselves belong to
their publishers.
