const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');

// Function to fetch all products from the server
async function fetchProducts() {
  const response = await fetch('http://3.95.24.123:3000/products');
  const products = await response.json();

  // Clear product list
  productList.innerHTML = '';

  // Add each product to the list
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${product.name}</strong> - $${product.price}<br>
      <em>${product.description}</em>
    `;

    // Add delete button for each product
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Add update button for each product
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', async () => {
      const newName = prompt(`Enter new name for "${product.name}"`, product.name);
      const newPrice = prompt(`Enter new price for "${product.name}"`, product.price);
      const newDescription = prompt(`Enter new description for "${product.name}"`, product.description);

      // If the user provided all fields, update the product
      if (newName !== null && newPrice !== null && newDescription !== null) {
        await updateProduct(product.id, newName, parseFloat(newPrice), newDescription);
        await fetchProducts();
      }
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}

// Function to add a new product
async function addProduct(name, price, description) {
  const response = await fetch('http://3.95.24.123:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });
  return response.json();
}

// Function to delete a product
async function deleteProduct(id) {
  const response = await fetch('http://3.95.24.123:3000/products/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

// Function to update a product
async function updateProduct(id, name, price, description) {
  const response = await fetch('http://3.95.24.123:3000/products/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });
  return response.json();
}

// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value;
  await addProduct(name, parseFloat(price), description);
  addProductForm.reset();
  await fetchProducts();
});

// Fetch all products on page load
fetchProducts();



