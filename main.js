import './styles.css';

const productsUrl = 'https://fakestoreapi.com/products';
let productList = [];
let totalProducts = [];

const addEventListeners = () => {
  // For Searchbox
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const productListBuffer = JSON.parse(JSON.stringify(productList));
    renderProducts(
      productListBuffer.filter((product) =>
        product.title.includes(e.currentTarget.value)
      )
    );
  });

  // For Sorting
  const sortProduct = document.getElementById('sortProduct');
  sortProduct.addEventListener('change', function () {
    let productListBuffer = JSON.parse(JSON.stringify(productList));
    if (sortProduct.value == 'asc') {
      productListBuffer.sort((a, b) => a.price - b.price);
    } else {
      productListBuffer.sort((a, b) => b.price - a.price);
    }
    renderProducts(productListBuffer);
  });

  // on Load More Click
  const loadMoreIcon = document.getElementById('loadMore');
  loadMoreIcon.addEventListener('click', function () {
    renderProducts(totalProducts);
    loadMoreIcon.style.display = 'none';
  });
};

const getProducts = async () => {
  try {
    const response = await fetch(productsUrl);
    const products = await response.json();
    totalProducts = JSON.parse(JSON.stringify(products));
    renderProducts(products.splice(1, 10));
    productList = products;
    const categories = [...new Set(products.map((item) => item.category))];
    renderCategories(categories);
  } catch (err) {
    console.error(err);
  }
};

const renderProducts = (products) => {
  console.log('products', products);
  const container = document.getElementById('products-container');
  container.innerHTML = null;
  for (let i = 0; i < products.length; i++) {
    const details = products[i];
    const innerContainer = document.createElement('div');
    innerContainer.setAttribute('class', 'product__wrapper');

    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', details.image);
    imageElement.setAttribute('alt', 'product');
    innerContainer.appendChild(imageElement);

    const titleElement = document.createElement('div');
    titleElement.setAttribute('class', 'product__wrapper_title');
    titleElement.innerText = details.title;
    innerContainer.appendChild(titleElement);

    const priceElement = document.createElement('div');
    priceElement.setAttribute('class', 'product__wrapper_price');
    priceElement.innerText = '$' + details.price;
    innerContainer.appendChild(priceElement);

    const heartElement = document.createElement('i');
    heartElement.setAttribute('class', 'fa-light fa-heart');
    innerContainer.appendChild(heartElement);

    container.appendChild(innerContainer);
  }
  // Binding total count;
  const productsCountElement = document.getElementsByClassName('count');
  productsCountElement[0].innerText = products.length + ' Results';
};

const renderCategories = (categories) => {
  const categoriesContainer = document.getElementsByClassName(
    'main__filters_categories'
  );

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const innerContainer = document.createElement('div');
    innerContainer.setAttribute('class', 'main__filters_category');

    const checkBoxElement = document.createElement('input');
    checkBoxElement.setAttribute('type', 'checkbox');
    checkBoxElement.onchange = (event) =>
      onCategorySelect(category, event.target.checked);
    innerContainer.appendChild(checkBoxElement);

    const categoryElement = document.createElement('span');
    categoryElement.innerText = category;
    innerContainer.appendChild(categoryElement);

    categoriesContainer[0].appendChild(innerContainer);
  }
};

const onCategorySelect = (category, checked) => {
  const productListBuffer = JSON.parse(JSON.stringify(productList));
  renderProducts(
    productListBuffer.filter((product) =>
      checked ? product.category === category : true
    )
  );
};

addEventListeners();
getProducts();
