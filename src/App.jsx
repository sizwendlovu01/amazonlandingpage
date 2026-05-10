import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, MapPin, ChevronDown, Moon, Sun, Heart } from 'lucide-react';
import { products, categories } from './products';

function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('amazon-cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartTab, setCartTab] = useState('cart'); // 'cart' or 'wishlist'
  const [theme, setTheme] = useState(() => localStorage.getItem('amazon-theme') || 'light');
  
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('amazon-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const cartTotalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('amazon-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('amazon-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const isSaved = prev.some(item => item.id === product.id);
      return isSaved ? prev.filter(item => item.id !== product.id) : [...prev, product];
    });
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * 18 * item.qty), 0);

  useEffect(() => {
    localStorage.setItem('amazon-cart', JSON.stringify(cart));
  }, [cart]);

  // Mock data for the UI
  const quadCardData1 = [
    { title: "Beauty gifts", img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop" },
    { title: "Cozy gifts", img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop" },
    { title: "Home gifts", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop" },
    { title: "Hobbies & crafting", img: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=200&h=200&fit=crop" }
  ];

  const filteredProducts = products
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const recommendedCategory = cart.length > 0 ? cart[cart.length - 1].category : 'Electronics';
  const recommendations = products.filter(p => p.category === recommendedCategory && !cart.some(c => c.id === p.id));

  return (
    <div className="app">
      {/* Top Navbar */}
      <header className="navbar-container">
        <div className="navbar-main">
          <div className="nav-left">
            <div className="nav-brand">
              <svg viewBox="0 0 603 182" className="amazon-logo" xmlns="http://www.w3.org/2000/svg">
                <path d="m 374.00642,142.18404 c -34.99948,25.79739 -85.72909,39.56123 -129.40634,39.56123 -61.24255,0 -116.37656,-22.65135 -158.08757,-60.32496 -3.2771,-2.96252 -0.34083,-6.9999 3.59171,-4.69283 45.01431,26.19064 100.67269,41.94697 158.16623,41.94697 38.774689,0 81.4295,-8.02237 120.6499,-24.67006 5.92501,-2.51683 10.87999,3.88009 5.08607,8.17965" fill="#ff9900" />
                <path d="m 388.55678,125.53635 c -4.45688,-5.71527 -29.57261,-2.70033 -40.84585,-1.36327 -3.43442,0.41947 -3.95874,-2.56925 -0.86517,-4.71905 20.00346,-14.07844 52.82696,-10.01483 56.65462,-5.2958 3.82764,4.74526 -0.99624,37.64741 -19.79373,53.35128 -2.88385,2.41195 -5.63662,1.12734 -4.35198,-2.07113 4.2209,-10.53917 13.68519,-34.16054 9.20211,-39.90203" fill="#ff9900" />
                <g fill="#ffffff">
                  <path d="M 348.49744,20.06598 V 6.38079 c 0,-2.07113 1.57301,-3.46062 3.46062,-3.46062 h 61.26875 c 1.96628,0 3.53929,1.41571 3.53929,3.46062 v 11.71893 c -0.0262,1.96626 -1.67788,4.53551 -4.61418,8.59912 l -31.74859,45.32893 c 11.79759,-0.28837 24.25059,1.46814 34.94706,7.49802 2.41195,1.36327 3.06737,3.35575 3.25089,5.32203 V 99.4506 c 0,1.99248 -2.20222,4.32576 -4.5093,3.1198 -18.84992,-9.88376 -43.887,-10.95865 -64.72939,0.10487 -2.12356,1.15354 -4.35199,-1.15354 -4.35199,-3.14602 V 85.66054 c 0,-2.22843 0.0262,-6.02989 2.25463,-9.41186 l 36.78224,-52.74829 h -32.01076 c -1.96626,0 -3.53927,-1.38948 -3.53927,-3.43441" />
                  <path d="m 124.99883,105.45424 h -18.64017 c -1.78273,-0.13107 -3.19845,-1.46813 -3.32954,-3.17224 V 6.61676 c 0,-1.91383 1.59923,-3.43442 3.59171,-3.43442 h 17.38176 c 1.80898,0.0786 3.25089,1.46814 3.38199,3.19845 v 12.50545 h 0.34082 c 4.53551,-12.08598 13.05597,-17.7226 24.53896,-17.7226 11.66649,0 18.95477,5.63662 24.19814,17.7226 4.5093,-12.08598 14.76008,-17.7226 25.74495,-17.7226 7.81262,0 16.35931,3.22467 21.57646,10.46052 5.89879,8.04857 4.69281,19.74128 4.69281,29.99208 l -0.0262,60.37739 c 0,1.91383 -1.59923,3.46061 -3.59171,3.46061 h -18.61397 c -1.86138,-0.13107 -3.35574,-1.62543 -3.35574,-3.46061 V 51.29025 c 0,-4.03739 0.36702,-14.10466 -0.52434,-17.93233 -1.38949,-6.42311 -5.55797,-8.23209 -10.95865,-8.23209 -4.5093,0 -9.22833,3.01494 -11.14216,7.83885 -1.91383,4.8239 -1.73031,12.89867 -1.73031,18.32557 v 50.70338 c 0,1.91383 -1.59923,3.46061 -3.59171,3.46061 h -18.61395 c -1.88761,-0.13107 -3.35576,-1.62543 -3.35576,-3.46061 L 152.946,51.29025 c 0,-10.67025 1.75651,-26.37415 -11.48298,-26.37415 -13.39682,0 -12.87248,15.31063 -12.87248,26.37415 v 50.70338 c 0,1.91383 -1.59923,3.46061 -3.59171,3.46061" />
                  <path d="m 469.51439,1.16364 c 27.65877,0 42.62858,23.75246 42.62858,53.95427 0,29.17934 -16.54284,52.32881 -42.62858,52.32881 -27.16066,0 -41.94697,-23.75246 -41.94697,-53.35127 0,-29.78234 14.96983,-52.93181 41.94697,-52.93181 m 0.15729,19.53156 c -13.73761,0 -14.60278,18.71881 -14.60278,30.38532 0,11.69271 -0.18352,36.65114 14.44549,36.65114 14.44548,0 15.12712,-20.13452 15.12712,-32.40403 0,-8.07477 -0.34082,-17.72257 -2.779,-25.3779 -2.09735,-6.65906 -6.26581,-9.25453 -12.19083,-9.25453" />
                  <path d="M 548.00762,105.45424 H 529.4461 c -1.86141,-0.13107 -3.35577,-1.62543 -3.35577,-3.46061 l -0.0262,-95.69149 c 0.1573,-1.75653 1.7041,-3.1198 3.59171,-3.1198 h 17.27691 c 1.62543,0.0786 2.96249,1.17976 3.32954,2.67412 v 14.62899 h 0.3408 c 5.21717,-13.0822 12.53165,-19.32181 25.40412,-19.32181 8.36317,0 16.51662,3.01494 21.75999,11.27324 4.87633,7.65532 4.87633,20.5278 4.87633,29.78233 v 60.22011 c -0.20973,1.67786 -1.75653,3.01492 -3.59169,3.01492 h -18.69262 c -1.70411,-0.13107 -3.11982,-1.38948 -3.30332,-3.01492 V 50.47753 c 0,-10.46052 1.20597,-25.77117 -11.66651,-25.77117 -4.5355,0 -8.70399,3.04117 -10.77512,7.65532 -2.62167,5.84637 -2.96249,11.66651 -2.96249,18.11585 v 51.5161 c -0.0262,1.91383 -1.65166,3.46061 -3.64414,3.46061" />
                  <use href="#path30" transform="translate(244.36719)" />
                  <path id="path30" d="M 55.288261,59.75829 V 55.7209 c -13.475471,0 -27.711211,2.88385 -27.711211,18.77125 0,8.04857 4.16847,13.50169 11.32567,13.50169 5.24337,0 9.93618,-3.22467 12.8987,-8.46805 3.670341,-6.44935 3.486841,-12.50544 3.486841,-19.7675 m 18.79747,45.43378 c -1.23219,1.10111 -3.01495,1.17976 -4.40444,0.4457 -6.18716,-5.1385 -7.28828,-7.52423 -10.69647,-12.42678 -10.224571,10.4343 -17.460401,13.55409 -30.726141,13.55409 -15.67768,0 -27.89471,-9.67401 -27.89471,-29.04824 0,-15.12713 8.20587,-25.43035 19.87236,-30.46398 10.1197,-4.45688 24.25058,-5.24337 35.051931,-6.47556 v -2.41195 c 0,-4.43066 0.34082,-9.67403 -2.25465,-13.50167 -2.280881,-3.43442 -6.632861,-4.85013 -10.460531,-4.85013 -7.10475,0 -13.44924,3.64414 -14.99603,11.19459 -0.31461,1.67789 -1.5468,3.32955 -3.22467,3.4082 L 6.26276,32.67628 C 4.74218,32.33548 3.0643,31.10327 3.48377,28.76999 7.65225,6.85271 27.44596,0.24605 45.16856,0.24605 c 9.071011,0 20.921021,2.41195 28.078221,9.28076 9.07104,8.46804 8.20587,19.7675 8.20587,32.06321 v 29.04826 c 0,8.73022 3.61794,12.55786 7.02613,17.27691 1.20597,1.67786 1.46814,3.69656 -0.05244,4.95497 -3.80144,3.17225 -10.56538,9.07104 -14.28819,12.37436 l -0.05242,-0.0525" />
                </g>
              </svg>
              <span className="domain-ext">.co.za</span>
            </div>
            <div className="nav-location">
              <MapPin size={18} />
              <div className="location-text">
                <span className="loc-line1">Delivering to Johannesburg 2000</span>
                <span className="loc-line2">Update location</span>
              </div>
            </div>
          </div>

          <div className="nav-search-bar">
            <select className="search-dropdown">
              <option>All</option>
            </select>
            <input 
              type="text" 
              placeholder="Search Amazon.co.za" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn"><Search size={20} color="#333" /></button>
          </div>

          <div className="nav-right">
            <div className="nav-item theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div className="nav-lang">
              <span>EN</span> <ChevronDown size={14} />
            </div>
            <div className="nav-item">
              <span className="line1">Hello, sign in</span>
              <span className="line2">Account & Lists <ChevronDown size={14} /></span>
            </div>
            <div className="nav-item">
              <span className="line1">Returns</span>
              <span className="line2">& Orders</span>
            </div>
            <div className="nav-cart" onClick={() => setIsCartOpen(true)}>
              <div className="cart-icon-wrapper">
                <ShoppingCart size={32} />
                <span className="cart-count">{cartTotalItems}</span>
              </div>
              <span className="cart-text">Cart</span>
            </div>
          </div>
        </div>

        {/* Sub Navbar */}
        <div className="navbar-sub">
          <div className="sub-left">
            <div className="menu-btn">
              <Menu size={20} />
              <span>All</span>
            </div>
            <a href="#">Customer Service</a>
            <a href="#">Today's Deals</a>
            <a href="#">Keep Shopping For</a>
            <a href="#">Everyday Essentials</a>
            <a href="#">Sell on Amazon</a>
            <a href="#">Amazon Basics</a>
            <a href="#">Gift Cards</a>
          </div>
          <div className="sub-right">
            <a href="#" style={{fontWeight: 'bold'}}>15% off Everyday Essentials</a>
          </div>
        </div>
      </header>

      {/* Main Content Background */}
      <main className="main-content">
        
        {/* Hero Section */}
        <div className="hero-section">
          {/* We'll use a CSS gradient/image for the hero, matching the purple background in the reference */}
          <div className="hero-banner">
            <div className="hero-text">
              <h2>Cellphones & Accessories</h2>
              <div className="hero-badge">Starting from R249</div>
            </div>
            <img className="hero-img" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format" alt="Accessories" />
          </div>
        </div>

        {/* Content Cards (Overlapping Hero) */}
        <div className="cards-container overlap-grid">
          
          <div className="card quad-card">
            <h3>Mother's Day gifting</h3>
            <div className="quad-grid">
              {quadCardData1.map((item, i) => (
                <div key={i} className="quad-item">
                  <div className="img-wrap"><img src={item.img} alt={item.title} /></div>
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
            <a href="#" className="card-link">Shop now</a>
          </div>

          <div className="card quad-card">
            <h3>Shop Headphones &amp; Speakers</h3>
            <div className="quad-grid">
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" alt="Headphones" /></div><span>Headphones</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop" alt="Earbuds" /></div><span>Earbuds</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop" alt="Speakers" /></div><span>Speakers</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&h=200&fit=crop" alt="Home Audio" /></div><span>Home Audio</span></div>
            </div>
            <a href="#" className="card-link">See more</a>
          </div>

          <div className="card single-card">
            <h3>Shop Home & Kitchen</h3>
            <div className="single-img-wrap bg-orange"></div>
            <a href="#" className="card-link">See more</a>
          </div>

          <div className="card-stack">
            <div className="sign-in-card">
              <h3>Sign in for your best experience</h3>
              <button className="sign-in-btn-yellow">Sign in securely</button>
            </div>
            <div className="ad-card promo-yellow">
              <h3>Get 15% off your first order</h3>
              <p>Use Code: WELCOME15</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="card quad-card">
            <h3>15% off Everyday Essentials</h3>
            <div className="quad-grid">
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop" alt="Pantry" /></div><span>Pantry</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop" alt="Cleaning" /></div><span>Cleaning</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop" alt="Health" /></div><span>Health</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop" alt="Baby" /></div><span>Baby</span></div>
            </div>
            <a href="#" className="card-link">Shop now</a>
          </div>

          <div className="card single-card">
            <h3>Shop deals on Electrical</h3>
            <div className="single-img-wrap bg-green"></div>
            <a href="#" className="card-link">See more</a>
          </div>

          <div className="card single-card">
            <h3>Celebrate more with an Amazon gift card</h3>
            <div className="single-img-wrap bg-pink"></div>
            <a href="#" className="card-link">Shop options</a>
          </div>

          <div className="card quad-card">
            <h3>Welcome to Amazon</h3>
            <div className="quad-grid">
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1561715276-a2d087060f1d?w=200&h=200&fit=crop" alt="Your orders" /></div><span>Your orders</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=200&h=200&fit=crop" alt="Returns" /></div><span>Returns</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1553775927-a071d5a6a39a?w=200&h=200&fit=crop" alt="Customer Service" /></div><span>Customer Service</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" alt="Your Account" /></div><span>Your Account</span></div>
            </div>
            <a href="#" className="card-link">See more</a>
          </div>
        </div>

        {/* Welcome Deals Section */}
        <div className="deals-section">
          <div className="deals-header">
            <h3>Welcome deals</h3>
            <a href="#">See more</a>
          </div>
          <div className="deals-scroller">
            {products.map(product => (
              <div key={product.id} className="deal-item">
                <div className="deal-img-wrap" style={{position: 'relative'}}>
                  <img src={product.image} alt={product.title} />
                  <button 
                    onClick={() => toggleWishlist(product)}
                    style={{position: 'absolute', top: 5, right: 5, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: '5px', display: 'flex'}}
                  >
                    <Heart size={18} fill={wishlist.some(w => w.id === product.id) ? '#B12704' : 'none'} color={wishlist.some(w => w.id === product.id) ? '#B12704' : '#333'} />
                  </button>
                </div>
                <div className="deal-badge">Limited time deal</div>
                <div className="deal-price">R{(product.price * 18).toFixed(2)}</div>
                <div className="deal-title" style={{fontSize: '12px', margin: '5px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{product.title}</div>
                <button className="add-to-cart-btn" onClick={() => addToCart(product)} style={{width: '100%', padding: '5px', background: '#ffd814', border: '1px solid #fcd200', borderRadius: '100px', cursor: 'pointer', marginTop: 'auto', fontSize: '12px', color: '#0f1111'}}>Add to cart</button>
              </div>
            ))}
          </div>
        </div>

        {/* Circular Features Row */}
        <div className="feature-circles-section">
          <h3>Welcome to Amazon</h3>
          <div className="circles-row">
            {['Free delivery on first order', 'Delivery to pickup location', 'Order Tracking', 'Easy Returns', 'A-Z Guarantee', '24/7 Customer Support', 'Payment Options'].map((text, i) => (
              <div key={i} className="circle-item orange-circle">
                <div className="circle-icon"></div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* More Cards Row */}
        <div className="cards-container">
          <div className="card single-card">
            <h3>Shop TV & home Entertainment</h3>
            <div className="single-img-wrap bg-blue"></div>
            <a href="#" className="card-link">See more</a>
          </div>
          <div className="card single-card">
            <h3>Shop Vitamins and Supplements</h3>
            <div className="single-img-wrap bg-green"></div>
            <a href="#" className="card-link">See more</a>
          </div>
          <div className="card quad-card">
            <h3>Shop fitness</h3>
            <div className="quad-grid">
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop" alt="Weights" /></div><span>Weights</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=200&h=200&fit=crop" alt="Yoga" /></div><span>Yoga</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=200&h=200&fit=crop" alt="Cardio" /></div><span>Cardio</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop" alt="Accessories" /></div><span>Accessories</span></div>
            </div>
            <a href="#" className="card-link">See more</a>
          </div>
          <div className="card quad-card">
            <h3>Shop Computers &amp; Accessories</h3>
            <div className="quad-grid">
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop" alt="Laptops" /></div><span>Laptops</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1547082299-de196ea013d6?w=200&h=200&fit=crop" alt="Desktops" /></div><span>Desktops</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1527443224154-c4a573d5814e?w=200&h=200&fit=crop" alt="Monitors" /></div><span>Monitors</span></div>
              <div className="quad-item"><div className="img-wrap"><img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&h=200&fit=crop" alt="Accessories" /></div><span>Accessories</span></div>
            </div>
            <a href="#" className="card-link">See more</a>
          </div>
        </div>

        {/* Shop by Brand */}
        <div className="brand-strip">
          <h3>Shop by Brand</h3>
          <div className="brand-logos">
            <div className="logo-box">Apple</div>
            <div className="logo-box">Weber</div>
            <div className="logo-box">Belkin</div>
            <div className="logo-box">Smeg</div>
            <div className="logo-box">Instant</div>
            <div className="logo-box">JBL</div>
            <div className="logo-box">LEGO</div>
          </div>
        </div>

        {/* Shop our Categories */}
        <div className="feature-circles-section">
          <h3>Shop our Categories</h3>
          <div className="circles-row">
            {['Deals', 'Books', 'Electronics', 'Health & Personal Care', 'Jewellery', 'Toys & Games', 'Baby'].map((text, i) => (
              <div key={i} className="circle-item category-circle">
                <div className="circle-icon gray-circle"></div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Cards Row */}
        <div className="cards-container">
          <div className="card single-card">
            <h3>Shop Home Improvement</h3>
            <div className="single-img-wrap bg-orange"></div>
            <a href="#" className="card-link">See more</a>
          </div>
          <div className="card single-card">
            <h3>Books under R250</h3>
            <div className="single-img-wrap bg-yellow"></div>
            <a href="#" className="card-link">See more</a>
          </div>
          <div className="card single-card">
            <h3>Shop Hair Care</h3>
            <div className="single-img-wrap bg-green"></div>
            <a href="#" className="card-link">See more</a>
          </div>
          <div className="card single-card">
            <h3>Skincare essentials</h3>
            <div className="single-img-wrap bg-orange"></div>
            <a href="#" className="card-link">See more</a>
          </div>
        </div>

        {/* Personalised Recommendations */}
        <div className="personalised-section">
          <div className="recommendations-box">
            <p>See personalised recommendations</p>
            <button className="sign-in-btn-yellow wide">Sign in</button>
            <p className="new-customer">New customer? <a href="#">Start here.</a></p>
          </div>
        </div>

        {/* Shop All Products Section */}
        <div className="shop-all-section" style={{ display: 'flex', gap: '20px', padding: '20px', background: 'var(--bg-color)', color: 'var(--text-main)' }}>
          <div className="filter-sidebar" style={{ width: '250px', background: 'var(--card-bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h3>Filters</h3>
            
            <div style={{ marginTop: '20px' }}>
              <h4>Category</h4>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categories.map(cat => (
                  <li 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    style={{ cursor: 'pointer', color: activeCategory === cat ? 'var(--amazon-orange)' : 'var(--text-main)', fontWeight: activeCategory === cat ? 'bold' : 'normal' }}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4>Sort By</h4>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '10px', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
              >
                <option value="">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
              </select>
            </div>
          </div>

          <div className="product-grid-main" style={{ flex: 1 }}>
            <h2 style={{ marginBottom: '20px' }}>Results {searchQuery && `for "${searchQuery}"`}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {filteredProducts.length === 0 ? (
                <p>No products found.</p>
              ) : (
                filteredProducts.map(product => (
                  <div key={`grid-${product.id}`} className="deal-item" style={{ maxWidth: '100%' }}>
                    <div className="deal-img-wrap" style={{position: 'relative', height: '200px'}}>
                      <img src={product.image} alt={product.title} style={{ objectFit: 'contain' }} />
                      <button 
                        onClick={() => toggleWishlist(product)}
                        style={{position: 'absolute', top: 5, right: 5, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: '5px', display: 'flex'}}
                      >
                        <Heart size={18} fill={wishlist.some(w => w.id === product.id) ? '#B12704' : 'none'} color={wishlist.some(w => w.id === product.id) ? '#B12704' : '#333'} />
                      </button>
                    </div>
                    <div className="deal-title" style={{fontSize: '14px', margin: '10px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{product.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                      <span style={{ color: '#ffa41c', fontSize: '14px' }}>{'★'.repeat(Math.round(product.rating))}</span>
                      <span style={{ color: 'var(--link-color)', fontSize: '12px' }}>{product.rating}</span>
                    </div>
                    <div className="deal-price" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>R{(product.price * 18).toFixed(2)}</div>
                    <button className="add-to-cart-btn" onClick={() => addToCart(product)} style={{width: '100%', padding: '8px', background: '#ffd814', border: '1px solid #fcd200', borderRadius: '100px', cursor: 'pointer', marginTop: 'auto', fontSize: '14px', color: '#0f1111'}}>Add to cart</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendations.length > 0 && (
          <div className="deals-section" style={{ background: 'var(--card-bg)', color: 'var(--text-main)', marginTop: '20px' }}>
            <div className="deals-header">
              <h3 style={{ color: 'var(--text-main)' }}>You may also like (Based on your interest in {recommendedCategory})</h3>
            </div>
            <div className="deals-scroller">
              {recommendations.map(product => (
                <div key={`rec-${product.id}`} className="deal-item" style={{ border: '1px solid var(--border-color)' }}>
                  <div className="deal-img-wrap" style={{position: 'relative'}}>
                    <img src={product.image} alt={product.title} />
                    <button 
                      onClick={() => toggleWishlist(product)}
                      style={{position: 'absolute', top: 5, right: 5, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: '5px', display: 'flex'}}
                    >
                      <Heart size={18} fill={wishlist.some(w => w.id === product.id) ? '#B12704' : 'none'} color={wishlist.some(w => w.id === product.id) ? '#B12704' : '#333'} />
                    </button>
                  </div>
                  <div className="deal-price">R{(product.price * 18).toFixed(2)}</div>
                  <div className="deal-title" style={{fontSize: '12px', margin: '5px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{product.title}</div>
                  <button className="add-to-cart-btn" onClick={() => addToCart(product)} style={{width: '100%', padding: '5px', background: '#ffd814', border: '1px solid #fcd200', borderRadius: '100px', cursor: 'pointer', marginTop: 'auto', fontSize: '12px', color: '#0f1111'}}>Add to cart</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="back-to-top">Back to top</div>
        <div className="footer-links-container">
          <div className="footer-column">
            <h3>Get to Know Us</h3>
            <a href="#">Careers</a>
            <a href="#">Legal Notes</a>
            <a href="#">Welcome to Amazon.co.za</a>
          </div>
          <div className="footer-column">
            <h3>Make Money with Us</h3>
            <a href="#">Advertise Your Products</a>
            <a href="#">Sell on Amazon</a>
            <a href="#">Register on Business</a>
          </div>
          <div className="footer-column">
            <h3>Amazon Payment Methods</h3>
            <a href="#">Payment Methods Help</a>
          </div>
          <div className="footer-column">
            <h3>Let Us Help You</h3>
            <a href="#">Track Packages or View Orders</a>
            <a href="#">Shipping Rates & Policies</a>
            <a href="#">Returns & Replacements</a>
            <a href="#">Help & 24/7 Customer Service</a>
            <a href="#">Amazon Mobile App</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-logo">
            <svg viewBox="0 0 603 182" style={{height:'30px', width:'auto'}} xmlns="http://www.w3.org/2000/svg">
              <path d="m 374.00642,142.18404 c -34.99948,25.79739 -85.72909,39.56123 -129.40634,39.56123 -61.24255,0 -116.37656,-22.65135 -158.08757,-60.32496 -3.2771,-2.96252 -0.34083,-6.9999 3.59171,-4.69283 45.01431,26.19064 100.67269,41.94697 158.16623,41.94697 38.774689,0 81.4295,-8.02237 120.6499,-24.67006 5.92501,-2.51683 10.87999,3.88009 5.08607,8.17965" fill="#ff9900" />
              <path d="m 388.55678,125.53635 c -4.45688,-5.71527 -29.57261,-2.70033 -40.84585,-1.36327 -3.43442,0.41947 -3.95874,-2.56925 -0.86517,-4.71905 20.00346,-14.07844 52.82696,-10.01483 56.65462,-5.2958 3.82764,4.74526 -0.99624,37.64741 -19.79373,53.35128 -2.88385,2.41195 -5.63662,1.12734 -4.35198,-2.07113 4.2209,-10.53917 13.68519,-34.16054 9.20211,-39.90203" fill="#ff9900" />
              <g fill="#ffffff">
                <path d="M 348.49744,20.06598 V 6.38079 c 0,-2.07113 1.57301,-3.46062 3.46062,-3.46062 h 61.26875 c 1.96628,0 3.53929,1.41571 3.53929,3.46062 v 11.71893 c -0.0262,1.96626 -1.67788,4.53551 -4.61418,8.59912 l -31.74859,45.32893 c 11.79759,-0.28837 24.25059,1.46814 34.94706,7.49802 2.41195,1.36327 3.06737,3.35575 3.25089,5.32203 V 99.4506 c 0,1.99248 -2.20222,4.32576 -4.5093,3.1198 -18.84992,-9.88376 -43.887,-10.95865 -64.72939,0.10487 -2.12356,1.15354 -4.35199,-1.15354 -4.35199,-3.14602 V 85.66054 c 0,-2.22843 0.0262,-6.02989 2.25463,-9.41186 l 36.78224,-52.74829 h -32.01076 c -1.96626,0 -3.53927,-1.38948 -3.53927,-3.43441" />
                <path d="m 124.99883,105.45424 h -18.64017 c -1.78273,-0.13107 -3.19845,-1.46813 -3.32954,-3.17224 V 6.61676 c 0,-1.91383 1.59923,-3.43442 3.59171,-3.43442 h 17.38176 c 1.80898,0.0786 3.25089,1.46814 3.38199,3.19845 v 12.50545 h 0.34082 c 4.53551,-12.08598 13.05597,-17.7226 24.53896,-17.7226 11.66649,0 18.95477,5.63662 24.19814,17.7226 4.5093,-12.08598 14.76008,-17.7226 25.74495,-17.7226 7.81262,0 16.35931,3.22467 21.57646,10.46052 5.89879,8.04857 4.69281,19.74128 4.69281,29.99208 l -0.0262,60.37739 c 0,1.91383 -1.59923,3.46061 -3.59171,3.46061 h -18.61397 c -1.86138,-0.13107 -3.35574,-1.62543 -3.35574,-3.46061 V 51.29025 c 0,-4.03739 0.36702,-14.10466 -0.52434,-17.93233 -1.38949,-6.42311 -5.55797,-8.23209 -10.95865,-8.23209 -4.5093,0 -9.22833,3.01494 -11.14216,7.83885 -1.91383,4.8239 -1.73031,12.89867 -1.73031,18.32557 v 50.70338 c 0,1.91383 -1.59923,3.46061 -3.59171,3.46061 h -18.61395 c -1.88761,-0.13107 -3.35576,-1.62543 -3.35576,-3.46061 L 152.946,51.29025 c 0,-10.67025 1.75651,-26.37415 -11.48298,-26.37415 -13.39682,0 -12.87248,15.31063 -12.87248,26.37415 v 50.70338 c 0,1.91383 -1.59923,3.46061 -3.59171,3.46061" />
                <path d="m 469.51439,1.16364 c 27.65877,0 42.62858,23.75246 42.62858,53.95427 0,29.17934 -16.54284,52.32881 -42.62858,52.32881 -27.16066,0 -41.94697,-23.75246 -41.94697,-53.35127 0,-29.78234 14.96983,-52.93181 41.94697,-52.93181 m 0.15729,19.53156 c -13.73761,0 -14.60278,18.71881 -14.60278,30.38532 0,11.69271 -0.18352,36.65114 14.44549,36.65114 14.44548,0 15.12712,-20.13452 15.12712,-32.40403 0,-8.07477 -0.34082,-17.72257 -2.779,-25.3779 -2.09735,-6.65906 -6.26581,-9.25453 -12.19083,-9.25453" />
                <path d="M 548.00762,105.45424 H 529.4461 c -1.86141,-0.13107 -3.35577,-1.62543 -3.35577,-3.46061 l -0.0262,-95.69149 c 0.1573,-1.75653 1.7041,-3.1198 3.59171,-3.1198 h 17.27691 c 1.62543,0.0786 2.96249,1.17976 3.32954,2.67412 v 14.62899 h 0.3408 c 5.21717,-13.0822 12.53165,-19.32181 25.40412,-19.32181 8.36317,0 16.51662,3.01494 21.75999,11.27324 4.87633,7.65532 4.87633,20.5278 4.87633,29.78233 v 60.22011 c -0.20973,1.67786 -1.75653,3.01492 -3.59169,3.01492 h -18.69262 c -1.70411,-0.13107 -3.11982,-1.38948 -3.30332,-3.01492 V 50.47753 c 0,-10.46052 1.20597,-25.77117 -11.66651,-25.77117 -4.5355,0 -8.70399,3.04117 -10.77512,7.65532 -2.62167,5.84637 -2.96249,11.66651 -2.96249,18.11585 v 51.5161 c -0.0262,1.91383 -1.65166,3.46061 -3.64414,3.46061" />
                <path id="footer-path30" d="M 55.288261,59.75829 V 55.7209 c -13.475471,0 -27.711211,2.88385 -27.711211,18.77125 0,8.04857 4.16847,13.50169 11.32567,13.50169 5.24337,0 9.93618,-3.22467 12.8987,-8.46805 3.670341,-6.44935 3.486841,-12.50544 3.486841,-19.7675 m 18.79747,45.43378 c -1.23219,1.10111 -3.01495,1.17976 -4.40444,0.4457 -6.18716,-5.1385 -7.28828,-7.52423 -10.69647,-12.42678 -10.224571,10.4343 -17.460401,13.55409 -30.726141,13.55409 -15.67768,0 -27.89471,-9.67401 -27.89471,-29.04824 0,-15.12713 8.20587,-25.43035 19.87236,-30.46398 10.1197,-4.45688 24.25058,-5.24337 35.051931,-6.47556 v -2.41195 c 0,-4.43066 0.34082,-9.67403 -2.25465,-13.50167 -2.280881,-3.43442 -6.632861,-4.85013 -10.460531,-4.85013 -7.10475,0 -13.44924,3.64414 -14.99603,11.19459 -0.31461,1.67789 -1.5468,3.32955 -3.22467,3.4082 L 6.26276,32.67628 C 4.74218,32.33548 3.0643,31.10327 3.48377,28.76999 7.65225,6.85271 27.44596,0.24605 45.16856,0.24605 c 9.071011,0 20.921021,2.41195 28.078221,9.28076 9.07104,8.46804 8.20587,19.7675 8.20587,32.06321 v 29.04826 c 0,8.73022 3.61794,12.55786 7.02613,17.27691 1.20597,1.67786 1.46814,3.69656 -0.05244,4.95497 -3.80144,3.17225 -10.56538,9.07104 -14.28819,12.37436 l -0.05242,-0.0525" />
                <use href="#footer-path30" transform="translate(244.36719)" />
              </g>
            </svg>
            <span style={{color:'#fff', fontSize:'1rem', marginLeft:'2px', verticalAlign:'bottom'}}>.co.za</span>
          </div>
          <div className="footer-legal">
            <a href="#">Conditions of Use & Sale</a>
            <a href="#">Privacy Notice</a>
            <a href="#">Cookies Notice</a>
            <a href="#">Interest-Based Ads Notice</a>
            <p>© 1996-2026, Amazon.com, Inc. or its affiliates</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-sidebar" onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', color: 'var(--text-main)' }}>
            <div className="cart-header" style={{ background: 'var(--nav-sub-bg)', color: 'white' }}>
              <h2>Your Lists</h2>
              <button onClick={() => setIsCartOpen(false)} className="close-cart" style={{ color: 'white' }}>X</button>
            </div>
            
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
              <button 
                onClick={() => setCartTab('cart')}
                style={{ flex: 1, padding: '15px', fontWeight: 'bold', color: cartTab === 'cart' ? 'var(--amazon-orange)' : 'var(--text-main)', borderBottom: cartTab === 'cart' ? '2px solid var(--amazon-orange)' : 'none' }}
              >
                Cart ({cartTotalItems})
              </button>
              <button 
                onClick={() => setCartTab('wishlist')}
                style={{ flex: 1, padding: '15px', fontWeight: 'bold', color: cartTab === 'wishlist' ? 'var(--amazon-orange)' : 'var(--text-main)', borderBottom: cartTab === 'wishlist' ? '2px solid var(--amazon-orange)' : 'none' }}
              >
                Wishlist ({wishlist.length})
              </button>
            </div>

            <div className="cart-items">
              {cartTab === 'cart' ? (
                cart.length === 0 ? (
                  <p>Your Amazon Cart is empty.</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="cart-item" style={{ borderColor: 'var(--border-color)' }}>
                      <img src={item.image} alt={item.title} />
                      <div className="cart-item-details">
                        <h4>{item.title}</h4>
                        <p className="cart-item-price">R{(item.price * 18).toFixed(2)}</p>
                        <div className="cart-item-actions">
                          <div className="qty-selector">
                            <button onClick={() => updateQuantity(item.id, -1)} style={{ color: 'var(--text-main)' }}>-</button>
                            <span style={{ color: 'var(--text-main)' }}>{item.qty}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} style={{ color: 'var(--text-main)' }}>+</button>
                          </div>
                          <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                wishlist.length === 0 ? (
                  <p>Your Wishlist is empty.</p>
                ) : (
                  wishlist.map(item => (
                    <div key={`wish-${item.id}`} className="cart-item" style={{ borderColor: 'var(--border-color)' }}>
                      <img src={item.image} alt={item.title} />
                      <div className="cart-item-details">
                        <h4>{item.title}</h4>
                        <p className="cart-item-price">R{(item.price * 18).toFixed(2)}</p>
                        <button className="add-to-cart-btn" onClick={() => addToCart(item)} style={{ padding: '5px', background: '#ffd814', border: '1px solid #fcd200', borderRadius: '100px', cursor: 'pointer', fontSize: '12px', color: '#0f1111', marginTop: '5px' }}>Move to Cart</button>
                        <button className="remove-btn" onClick={() => toggleWishlist(item)} style={{ marginTop: '5px', alignSelf: 'flex-start' }}>Remove</button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
            
            {cartTab === 'cart' && cart.length > 0 && (
              <div className="cart-footer" style={{ background: 'var(--bg-color)', borderTop: '1px solid var(--border-color)' }}>
                <div className="cart-subtotal">
                  <span>Subtotal ({cartTotalItems} items):</span>
                  <span className="subtotal-price" style={{ color: '#B12704' }}>R{cartSubtotal.toFixed(2)}</span>
                </div>
                <button className="checkout-btn" onClick={() => setIsCheckoutOpen(true)}>Proceed to Checkout</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="cart-overlay" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="checkout-modal" style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: '8px', width: '400px', color: 'var(--text-main)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            <h2 style={{ marginBottom: '20px' }}>Secure Checkout</h2>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              alert("Order Placed Successfully!"); 
              setCart([]); 
              setIsCheckoutOpen(false); 
              setIsCartOpen(false); 
            }}>
              <div style={{ marginTop: '15px' }}>
                <label style={{ fontWeight: 'bold' }}>Full Name</label>
                <input required type="text" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }} />
              </div>
              <div style={{ marginTop: '15px' }}>
                <label style={{ fontWeight: 'bold' }}>Shipping Address</label>
                <input required type="text" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }} />
              </div>
              <div style={{ marginTop: '15px' }}>
                <label style={{ fontWeight: 'bold' }}>Delivery Option</label>
                <select style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}>
                  <option>Standard Delivery (3-5 Business Days)</option>
                  <option>Express Delivery (1-2 Business Days) - R150</option>
                </select>
              </div>
              <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setIsCheckoutOpen(false)} style={{ flex: 1, padding: '12px', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#ffd814', color: '#0f1111', border: '1px solid #fcd200', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Place Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
