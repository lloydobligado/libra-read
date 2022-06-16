// -----Event: Logo Hover-----
const logo = document.querySelector('.logo');

logo.onmouseover = () => {
    logo.src = "assets/images/logo/logo__primary.png"
}
logo.onmouseout = () => {
    logo.src = "assets/images/logo/logo__dark.png"
}

// -----Event: Navigational Bar Toggle-----
const hamburger = document.querySelector('.hamburger')
const menuContainer = document.querySelector('.menu-container')

hamburger.addEventListener('click', () => {
    menuContainer.classList.toggle('active');
})
    // Hamburger to Exit Button
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open')
    });

// -----Event: Remove Hamburger Menu-----
window.addEventListener('resize', () => {
    if (window.innerWidth > 767) {
        if(menuContainer.className.includes('active')) {
            menuContainer.classList.remove('active')
        }
    }
})

// -----Book Class: Represent a Book-----
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// -----UI Class: Represent a UI Task-----
class UI {
    static displayBooks() {
       const books = Store.getBooks();
       
       books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector(`tbody`);
        const row = document.createElement(`tr`)

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>
            <a href="#" class="fa-solid fa-trash-can delete">
            </a>
        </td>`;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }


    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert__${className}`
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.hero-container')
        const form = document.querySelector('.hero-container__form')
        container.insertBefore(div, form)
        // vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearField() {
        document.querySelector('#title').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#isbn').value = ""
    }
}

// -----Store Class: Handles Storage------
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        }
        else {
           books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push();
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1)
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// -----Event:  Display Book-----
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// -----Event: Add Book-----
document.querySelector('.hero-container__form').addEventListener('submit', (e) => {
    e.preventDefault();

    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all field', 'danger');
    }
    else {
        //initiate book
        const book = new Book(title, author, isbn);

        //add book to UI
        UI.addBookToList(book);

        // add book to store
        Store.addBook(book);
        
        // show success message
        UI.showAlert('Book Added', 'success');

        // Clear Fields
        UI.clearField();
    }
});

// -----Event: Remove Book-----
document.querySelector(`tbody`).addEventListener('click', (e) => {
    //remove book from UI
    UI.deleteBook(e.target)

    //remove book from storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // show success message
    UI.showAlert('Book Removed', 'success');
});