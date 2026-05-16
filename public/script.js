const showPage = (pageID) => {
    let pages = document.querySelectorAll(".content")

    pages.forEach(page => {
        page.classList.remove("active")
    })

    document.getElementById(pageID).classList.add("active");
}