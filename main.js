// Do your work here...
const STORAGE_KEY = "BOOKSHELF_APP";

document.addEventListener("DOMContentLoaded", function () {
  if (!isStorageExist()) {
    alert("Browser tidak mendukung local storage!");
    return;
  }

  loadDataFromStorage();

  document.getElementById("bookForm").addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  document.getElementById("searchBook").addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });
});

function isStorageExist() {
  return typeof Storage !== "undefined";
}

function getBooks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const books = getBooks();
  const newBook = {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveBooks(books);
  renderBooks();
  document.getElementById("bookForm").reset();
}

function loadDataFromStorage() {
  renderBooks();
}

function renderBooks() {
  const incompleteBookshelf = document.getElementById("incompleteBookList");
  const completeBookshelf = document.getElementById("completeBookList");
  const books = getBooks();

  incompleteBookshelf.innerHTML = "";
  completeBookshelf.innerHTML = "";

  books.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookshelf.appendChild(bookElement);
    } else {
      incompleteBookshelf.appendChild(bookElement);
    }
  });
}

function createBookElement(book) {
  const bookItem = document.createElement("div");
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");

  bookItem.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button onclick="toggleBookStatus(${book.id})" data-testid="bookItemIsCompleteButton">
        ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
      </button>
      <button onclick="deleteBook(${book.id})" data-testid="bookItemDeleteButton">Hapus Buku</button>
    </div>
  `;
  return bookItem;
}

function toggleBookStatus(bookId) {
  const books = getBooks();
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBooks(books);
    renderBooks();
  }
}

function deleteBook(bookId) {
  let books = getBooks();
  books = books.filter((book) => book.id !== bookId);
  saveBooks(books);
  renderBooks();
}

function searchBook() {
  const searchTerm = document.getElementById("searchBookTitle").value.toLowerCase();
  const books = getBooks().filter((book) => book.title.toLowerCase().includes(searchTerm));
  
  const incompleteBookshelf = document.getElementById("incompleteBookList");
  const completeBookshelf = document.getElementById("completeBookList");

  incompleteBookshelf.innerHTML = "";
  completeBookshelf.innerHTML = "";

  books.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookshelf.appendChild(bookElement);
    } else {
      incompleteBookshelf.appendChild(bookElement);
    }
  });
}
