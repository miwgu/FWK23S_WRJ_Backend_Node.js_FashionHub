drop database if exists fashionhub_db2024;
create database fashionhub_db2024;
use fashionhub_db2024;

-- Create fashion_products table
CREATE TABLE fashion_products (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    image VARCHAR(500) NOT NULL,
    price DECIMAL(10, 2),
    category VARCHAR(50) NOT NULL
);

-- Insert products into the table
INSERT INTO fashion_products (id, title, description, image, price, category) VALUES
(1, 'Striped Knit Sweater', 'Stay cozy and stylish with this striped knit sweater. Perfect for casual outings or lounging at home.', 'https://images.pexels.com/photos/15031659/pexels-photo-15031659/free-photo-of-mode-kvinna-modell-troja.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 399.00, 'Sweaters'),
(2, 'Denim Jacket', 'Classic denim jacket featuring distressed detailing. A versatile piece for any wardrobe.', 'https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg', 599.00, 'Jackets'),
(3, 'Floral Print Dress', 'Elegant floral print dress with a flattering silhouette. Ideal for both casual and formal occasions.', 'https://images.pexels.com/photos/4355789/pexels-photo-4355789.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 699.00, 'Dresses'),
(4, 'Slim Fit Jeans', 'Classic slim fit jeans crafted from premium denim. A wardrobe essential for every season.', 'https://images.pexels.com/photos/20669432/pexels-photo-20669432/free-photo-of-kvinna-modell-jeans-leende.jpeg', 449.00, 'Jeans'),
(5, 'Leather Crossbody Bag', 'Chic leather crossbody bag featuring multiple compartments for your essentials. Perfect for on-the-go style.', 'https://images.pexels.com/photos/15831353/pexels-photo-15831353/free-photo-of-kvinna-staende-lutande-brunett.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 699.00, 'Accessories'),
(6, 'Crew Neck T-Shirt', 'Soft and comfortable crew neck t-shirt in a variety of colors. An everyday staple for any wardrobe.', 'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 199.00, 'T-Shirts'),
(7, 'High-Waisted Leggings', 'Stretchy high-waisted leggings for ultimate comfort and style. Perfect for workouts or lounging.', 'https://images.pexels.com/photos/2744192/pexels-photo-2744192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 245.00, 'Leggings'),
(8, 'Plaid Button-Up Shirt', 'Classic plaid button-up shirt crafted from soft cotton. Versatile for both casual and semi-formal occasions.', 'https://images.pexels.com/photos/6875728/pexels-photo-6875728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 349.00, 'Shirts'),
(9, 'Faux Fur Coat', 'Stay warm and stylish with this luxurious faux fur coat. A statement piece for any winter wardrobe.', 'https://images.pexels.com/photos/2852917/pexels-photo-2852917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 799.00, 'Coats'),
(10, 'Thick-Soled Long Boots', 'Step out in style with these chic thick-soled long boots. Crafted from high-quality materials, these boots feature a sturdy sole for added comfort and durability. With their long design, they provide extra coverage and warmth, making them perfect for cooler weather. Whether paired with jeans or dresses, these boots are sure to elevate any outfit.', 'https://images.pexels.com/photos/20427511/pexels-photo-20427511/free-photo-of-solglasogon-modell-staende-portratt.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 1099.00, 'Shoes'),
(11, 'Knit Beanie Hat', 'Cozy knit beanie hat to keep you warm during the colder months. Available in various colors.', 'https://images.pexels.com/photos/7585205/pexels-photo-7585205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 149.00, 'Accessories'),
(12, 'Pleated Midi Skirt', 'Elegant pleated midi skirt perfect for adding a feminine touch to your ensemble. Versatile for both casual and formal wear.', 'https://images.pexels.com/photos/5255015/pexels-photo-5255015.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 549.00, 'Skirts'),
(13, 'Oversized Sunglasses', 'Chic oversized sunglasses to shield your eyes in style. Available in various frame colors.', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 249.00, 'Accessories'),
(14, 'Cropped Hoodie', 'Stay cozy and stylish with this cropped hoodie featuring a drawstring hood and kangaroo pocket.', 'https://images.pexels.com/photos/789712/pexels-photo-789712.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 399.00, 'Hoodies'),
(15, 'Printed Scarf', 'Add a pop of color to your outfit with this vibrant printed scarf. Perfect for accessorizing any look.', 'https://images.pexels.com/photos/11022093/pexels-photo-11022093.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 199.00, 'Accessories'),
(16, 'Trench Coat', 'Classic trench coat crafted from durable cotton blend fabric. A timeless addition to your outerwear collection.', 'https://images.pexels.com/photos/10057708/pexels-photo-10057708.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 899.00, 'Coats'),
(17, 'Ribbed Knit Sweater Dress', 'Stay cozy and chic with this ribbed knit sweater dress. Perfect for layering or wearing on its own.', 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 499.00, 'Dresses'),
(18, 'Canvas Tote Bag', 'Spacious canvas tote bag perfect for carrying all your essentials. Ideal for work, school, or weekend outings.', 'https://images.pexels.com/photos/3607627/pexels-photo-3607627.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 299.00, 'Accessories'),
(19, 'Ruffled Blouse', 'Feminine ruffled blouse featuring a V-neckline and button-front closure. Perfect for adding a touch of elegance to your wardrobe.', 'https://images.pexels.com/photos/17664822/pexels-photo-17664822/free-photo-of-stad-solglasogon-kvinna-gata.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 399.00, 'Blouses'),
(20, 'Textured jacket', 'Elevate your outerwear collection with this sophisticated textured jacket. Featuring a unique texture pattern and tailored silhouette, this jacket adds a touch of elegance to any ensemble.', 'https://images.pexels.com/photos/9331285/pexels-photo-9331285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 799.00, 'Jackets');

-- Create customers table
CREATE TABLE customers (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    telephone VARCHAR(15),
    address VARCHAR(255),
    city VARCHAR(255),
    postcode VARCHAR(10),
    password VARCHAR(255)
);

-- Insert customers into the table
INSERT INTO customers (id, firstname, lastname, email, telephone, address, city, postcode, password)
VALUES 
(1, 'Miwa', 'G', 'miwa.g@example.com', '0701112222', 'Parkmainvägen', 'Stockholm', '10001', 'efdccfe935b909a40eb75d7ae8b1facc:26cd8326d906475f2edd70f8dc1c80880b7ee8dd0de2ce38f423da6899c2d506'),
(2, 'Oskar', 'G', 'oskar.g@example.com', '0807654321', 'ExampleElm', 'Uppsala', '90001', '5ced30ef6b809bd60dbbf25dc3537a7d:c2487646bda98b9c8259ea21925a68cdf9ee0ce5be72ae2d22344dab2de9d2aa');

CREATE TABLE orders (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_items (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES fashion_products(id)
);