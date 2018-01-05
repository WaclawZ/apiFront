$(document).ready(function () {

    function getBooks() {
        $.ajax({
            url: "http://localhost:8282/books"
        }).done(function (books) {
            printTitle(books);
            deleteLink();
            getTitle();
        })
    }

    function printTitle(books) {
        var bookTitle = $('.book-title');
        books.forEach(function (book) {
            if (book) {
                var row = $('<div class="book" id="' + book.id + '">' +
                    '<div class="head">' +
                    '<div class="title d-inline">' + book.title + ' </div>' +
                    '<div class="delete d-inline btn-outline-danger">Delete</div></div>' +
                    '<div class="desc" style="display:none"></div>'
                );
                bookTitle.parent().append(row);
            }
        })
    }

    var btn = $('.btn-primary');
    btn.on('click', function (e) {
        e.preventDefault();
        var title = $('#title').val();
        var author = $('#author').val();
        var isbn = $('#isbn').val();
        var publisher = $('#publisher').val();
        var type = $('#type').val();

        var objToSend = {
            isbn: isbn,
            title: title,
            author: author,
            publisher: publisher,
            type: type
        }

        var myHeaders = new Headers({
            'content-type': 'aplication/json'
        });

        var myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(objToSend)
        };

        fetch("http://localhost:8282/books/add", myInit).then(function (response) {
            clearBooks();
            getBooks();
            clearForm();
        });
    })

    function deleteLink() {
        var deleteLinks = $('div.delete');
        deleteLinks.on('click', function (e) {

            e.preventDefault();
            var id = $(e.target).parent().parent().attr('id');
            var myHeaders = new Headers({
                'content-type': 'aplication/json'
            });

            var myInit = {
                method: 'DELETE',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default'
            };

            fetch("http://localhost:8282/books/remove/" + id, myInit).then(function (response) {
                clearBooks();
                getBooks();
            });
        })
    }

    function getTitle() {
        var title = $('.title');
        title.on('click', function (e) {
            var div = $(e.target).parent().parent();
            var id = div.attr('id');
            var myHeaders = new Headers({
                'content-type': 'aplication/json'
            });

            var myInit = {
                method: 'GET',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default'
            };

            fetch("http://localhost:8282/books/" + id, myInit).then(function (response) {
                var url = response.url;
                getOneBook(url, div);
            });
        })
    }

    function getOneBook(url, div) {
        $.ajax({
            url: url
        }).done(function (book) {
            printDescription(book, div);
        })
    }

    function printDescription(book, div) {
        var allDescription = $('.desc');
        allDescription.text('');
        description = div.children().next();
        if (description.css('display') === 'inline') {
            description.css('display', 'none');
        } else {
            allDescription.css('display', 'none');
            description.css('display', 'initial');
            var content = $('<div class="content container-fluid"><div class="row"><div class="col-sm">Author: <label>' + book.author + '</label></div>' +
                '<div class="col-sm">Publisher: <label>' + book.publisher + '</label></div>' +
                '<div class="col-sm">Type: <label>' + book.type + '</label></div>' +
                '<div class="col-sm">ISBN: <label>' + book.isbn + '</label></div></div></div>');
            description.append(content);
        }
    }

    function clearBooks() {
        var books = $('.book');
        books.remove();
    }
    function clearForm() {
        var inputs = $('input');
        inputs.val("");
    }
    getBooks();
})