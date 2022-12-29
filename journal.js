"use strict"
const journalForm = document.querySelector("#journal-form")
const journalHeadingInput = document.querySelector("#journal-heading")
const journalTextarea = document.querySelector("#journal-text")
const warningHeading = document.querySelector(".journal-form-heading .warning")
const warningText = document.querySelector(".journal-form-text .warning")
const journalDateInput = document.querySelector("#journal-entry-date")
const template = document.querySelector("#journal-item-template")
const createEntryButton = document.querySelector("#create-entry")
const journalList = document.createElement("ul")
journalList.classList.add("journal-list")
journalList.setAttribute("id", "journal-list")
journalForm.after(journalList)

const LOCAL_STORAGE_PREFIX = "V1_ENTRIES-LIST"
const ENTRIES_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-entries`

// CREATE POST (this un-hides the form) *******
createEntryButton.addEventListener("click", (e) => {
  e.target.setAttribute("disabled", "true")
  journalForm.classList.remove("hide")
})

// FORM **************************************
const headingWarning = "Enter a title..."
const textWarning = "Enter some text..."
journalForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // Date - make it output to entry as DD/MM/YY
  const journalDateValue = journalDateInput.value
  const dateArray = journalDateValue.split("-")
  const journalDateString = dateArray.reverse().join("/")

  const journalHeading = journalHeadingInput.value
  const journalText = journalTextarea.value

  if (journalHeading === "" || journalText === "") return

  const newJournalEntry = {
    date: journalDateString,
    heading: journalHeading,
    text: journalText,
    edited: false,
    id: new Date().valueOf().toString(),
  }
  entries.push(newJournalEntry)
  renderJournalEntry(newJournalEntry)
  saveentries()
  journalDateInput.value = ""
  journalHeadingInput.value = ""
  journalTextarea.value = ""
})

// Event listeners for form input/textarea
clearPlaceholder(journalHeadingInput)
clearPlaceholder(journalTextarea)
warning(journalHeadingInput, warningHeading)
warning(journalTextarea, warningText)

// Publish button
const publishButton = document.querySelector("#publish")
publishButton.addEventListener("click", () => {
  const journalHeading = journalHeadingInput.value
  const journalText = journalTextarea.value

  populatePlaceholder(journalHeadingInput, journalTextarea)

  if (journalHeading === "") warningHeading.innerText = "Enter a heading"

  if (journalText === "") warningText.innerText = "Enter some text"

  if (journalHeading !== "" && journalText !== "") {
    journalForm.classList.add("hide")
    createEntryButton.removeAttribute("disabled")
  }
})

// Cancel button
const cancelButton = document.querySelector("#cancel")
cancelButton.addEventListener("click", () => {
  journalForm.classList.add("hide")
  populatePlaceholder(journalHeadingInput, journalTextarea)
  journalDateInput.value = ""
  journalHeadingInput.value = ""
  journalTextarea.value = ""
  warningHeading.innerText = ""
  warningText.innerText = ""
  createEntryButton.removeAttribute("disabled")
})

// POST **************************************

// Render entry
function renderJournalEntry(entry) {
  const templateClone = template.content.cloneNode(true)
  const journalItem = templateClone.querySelector(".journal-item")

  journalItem.dataset.entryId = entry.id

  const date = templateClone.querySelector("[data-journal-date]")
  date.innerText = entry.date

  const heading = templateClone.querySelector("[data-journal-heading]")
  heading.innerText = entry.heading

  const text = templateClone.querySelector("[data-journal-text]")
  text.innerText = entry.text

  journalList.appendChild(templateClone)
}

// Edit header button
journalList.addEventListener("click", (e) => {
  if (!e.target.matches("[data-button-heading-edit]")) return

  e.target.innerText =
    e.target.innerText === "Edit heading" ? "Save edit" : "Edit heading"

  const parent = e.target.closest(".journal-item")
  const heading = parent.querySelector("[data-journal-heading]")

  heading.toggleAttribute("contenteditable")

  const entryId = parent.dataset.entryId
  const entry = entries.find((p) => {
    return p.id === entryId
  })

  entry.edited = !heading.hasAttribute("contenteditable")

  if (entry.edited) {
    entry.heading = heading.innerText
  }

  saveEditClass(e)

  saveentries()
})

// Edit text button
journalList.addEventListener("click", (e) => {
  if (!e.target.matches("[data-button-text-edit]")) return

  e.target.innerText =
    e.target.innerText === "Edit text" ? "Save edit" : "Edit text"

  const parent = e.target.closest(".journal-item")
  const text = parent.querySelector("[data-journal-text]")

  text.toggleAttribute("contenteditable")

  const entryId = parent.dataset.entryId
  const entry = entries.find((p) => {
    return p.id === entryId
  })

  entry.edited = !text.hasAttribute("contenteditable")

  if (entry.edited) entry.text = text.innerText

  saveEditClass(e)

  saveentries()
})

// Delete button
journalList.addEventListener("click", (e) => {
  if (!e.target.matches("[data-button-journal-delete]")) return

  const result = confirm("Are you sure you want to delete this entry?")
  if (result) {
    const parent = e.target.closest(".journal-item")
    parent.remove()

    const entryId = parent.dataset.entryId

    entries = entries.filter((entry) => {
      return entry.id !== entryId
    })

    saveentries()
  }
})

// LOCAL STORAGE **************************************
let entries = loadentries()
entries.forEach((entry) => renderJournalEntry(entry))

function saveentries() {
  localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries))
}
function loadentries() {
  const entriesString = localStorage.getItem(ENTRIES_STORAGE_KEY)
  return JSON.parse(entriesString) || []
}

// HELPER FUNCTIONS **************************************
function clearPlaceholder(el) {
  el.addEventListener("focus", () => {
    el.setAttribute("placeholder", "")
  })
}

function populatePlaceholder(el1, el2) {
  if (el1.getAttribute("placeholder") === "")
    el1.setAttribute("placeholder", headingWarning)
  if (el2.getAttribute("placeholder") === "")
    el2.setAttribute("placeholder", textWarning)
}

function warning(el, text) {
  el.addEventListener("input", () => {
    if (el.value !== "") text.innerText = ""
  })
}

function saveEditClass(event) {
  event.target.classList.toggle("save-edit")
}
