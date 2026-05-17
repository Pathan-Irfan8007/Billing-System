const showPage = (pageID) => {
    let pages = document.querySelectorAll(".content")

    pages.forEach(page => {
        page.classList.remove("active")
    })

    document.getElementById(pageID).classList.add("active");
}

const getData = async () => {
    try{
        const res = await fetch('http://localhost:5000/customer')
        const customerData = await res.json()

        let output = ""
        customerData.forEach(customer => {
            output += `
                <div id="customerData">
                    <p><b>Name :</b> ${customer.name}</p><br>
                    <p><b>Mobile No :</b> ${customer.mob}</p><br>
                    <p><b>Product Name :</b> ${customer.product}</p><br>
                    <p><b>Price :</b> ${customer.price}</p><br>
                    <p><b>Payment Method :</b> ${customer.payment}</p><br>
                </div>
            `
        })
        document.getElementById('database').innerHTML = output
    } catch (error){
        console.log(`Something Went Wrong : ${error}`)
    }
}
getData()

document.getElementById('customerForm').addEventListener('submit', async (e) => {
    e.preventDefault()

    const customerData = {
        name : document.getElementById("name").value,
        mob : document.getElementById("mob").value,
        product : document.getElementById("product").value,
        price : document.getElementById("price").value,
        payment : document.getElementById("mode").value
    }

    try{
        const res = await fetch("http://localhost:5000/customer", {
            method : "POST",
            headers : {
                "content-type" : "Application/json"
            },
            body : JSON.stringify(customerData)
        })

        const data = await res.json()
        console.log(data)
        alert("Data Inserted Successfully.")

        await getData()
        document.getElementById("customerForm").reset()
        
    } catch (error) {
        console.log(`Somethig went wrong in data insertion ${error}`)
    }
})