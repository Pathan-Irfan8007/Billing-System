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
        customerData.sort((a,b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        )

        let output = `
        <table id="customerTable">
            <tr>
                <th>Name</th>
                <th>Mobile No</th>
                <th>Product</th>
                <th>Price</th>
                <th>Payment Mode</th>
                <th>Date</th>
            </tr>
        `;

        customerData.forEach(customer => {
            output += `
                <tr>
                    <td>${customer.name}</td>
                    <td>${customer.mob}</td>
                    <td>${customer.product}</td>
                    <td>${customer.price}</td>
                    <td>${customer.payment}</td>
                    <td>${new Date(customer.createdAt).toLocaleDateString('en-GB').replaceAll('/', '-')}</td>
                </tr>
            `;
        });

        output += `</table>`;

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
        payment : document.getElementById("mode").value,

        createdAt : new Date()
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