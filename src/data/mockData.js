import cupsProductImg from '../assets/images/cups-product.avif';
import cup3dImg from '../assets/images/cup-3d.png';

export const categoriesData = [
  {
    id: 1,
    name: "Cups & Mugs",
    icon: "fa-solid fa-mug-hot",
    image: cupsProductImg,
    hover3dImage: cup3dImg,
    fallbackImage: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&q=80",
    count: 94
  },
  {
    id: 2,
    name: "Photo Frames",
    icon: "fa-regular fa-image",
    image: "/assets/images/frames.avif",
    fallbackImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=500&q=80",
    count: 62
  },
  {
    id: 3,
    name: "Personalized Pens",
    icon: "fa-solid fa-pen-nib",
    image: "/assets/images/pens.avif",
    fallbackImage: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=500&q=80",
    count: 45
  },
  {
    id: 4,
    name: "Custom Wallets",
    icon: "fa-solid fa-wallet",
    image: "/assets/images/wallets.avif",
    fallbackImage: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=80",
    count: 38
  },
  {
    id: 5,
    name: "Home Decor & Lamps",
    icon: "fa-solid fa-lightbulb",
    image: "/assets/images/lamps.avif",
    fallbackImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80",
    count: 53
  },
  {
    id: 6,
    name: "Corporate Gifts",
    icon: "fa-solid fa-briefcase",
    image: "/assets/images/corporate-gifts.avif",
    fallbackImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=500&q=80",
    count: 70
  },
  {
    id: 7,
    name: "T-Shirts & Apparel",
    icon: "fa-solid fa-shirt",
    image: "/assets/images/t-shirt.avif",
    fallbackImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80",
    count: 120
  },
  {
    id: 8,
    name: "Gift Hampers & Sets",
    icon: "fa-solid fa-gift",
    image: "/assets/images/gifts.avif",
    fallbackImage: "https://images.unsplash.com/photo-1605808316692-a7d5bdc91fb3?auto=format&fit=crop&w=500&q=80",
    count: 85
  }
];

export const productsData = [
  {
    id: 101,
    name: "Premium Real Black Leather Wallet",
    cat_name: "WALLETS",
    category_id: 4,
    price: 699,
    old_price: 1199,
    image_url: "/assets/images/wallets.avif",
    fallback_image_url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviews_count: 124,
    doodle: "Premium Quality",
    show_on_home: 1
  },
  {
    id: 102,
    name: "Custom Printed Magic Mug",
    cat_name: "CUPS & MUGS",
    category_id: 1,
    price: 349,
    old_price: 549,
    image_url: "/assets/images/cups-product.avif",
    fallback_image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviews_count: 98,
    doodle: "Perfect for Gifting",
    show_on_home: 1
  },
  {
    id: 103,
    name: "Premium Couple Acrylic Photo Frame",
    cat_name: "PHOTO FRAMES",
    category_id: 2,
    price: 899,
    old_price: 1749,
    image_url: "/assets/images/frames.avif",
    fallback_image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviews_count: 210,
    show_on_home: 1
  },
  {
    id: 104,
    name: "Customized Graphic Cotton T-Shirt",
    cat_name: "T-SHIRTS",
    category_id: 7,
    price: 499,
    old_price: 899,
    image_url: "/assets/images/t-shirt.avif",
    fallback_image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviews_count: 156,
    show_on_home: 1
  },
  {
    id: 105,
    name: "Engraved Metal Ballpoint Pen",
    cat_name: "Pens",
    category_id: 5,
    price: 249,
    old_price: 399,
    image_url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    show_on_home: 1
  },
  {
    id: 106,
    name: "Custom Wooden Name Plate Lamp",
    cat_name: "Home Decor",
    category_id: 7,
    price: 1299,
    old_price: 1999,
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    show_on_home: 1
  },
  {
    id: 107,
    name: "Luxury Corporate Diary & Pen Set",
    cat_name: "Corporate",
    category_id: 8,
    price: 999,
    old_price: 1599,
    image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    show_on_home: 1
  },
  {
    id: 108,
    name: "Customized Photo Keychain & Charm",
    cat_name: "Accessories",
    category_id: 6,
    price: 199,
    old_price: 349,
    image_url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    show_on_home: 1
  }
];

export const testimonialsData = [
  {
    id: 1,
    title: "Great Product Quality",
    text: "The personalized photo frame we ordered for our anniversary was breathtaking. The colors were vibrant and build quality exceeded our expectations!",
    author: "Adam Stoung",
    role: "Furniture Designer",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 2,
    title: "Super Fast Delivery & Support",
    text: "I needed customized corporate gifts on short notice. The team delivered right on time with flawless printing. Highly recommended for bulk gifts!",
    author: "Jessica Young",
    role: "Marketing Stylist",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 3,
    title: "Memorable Birthday Gift",
    text: "Ordered a personalized magic mug and t-shirt for my brother's birthday. The print quality didn't fade even after multiple washes. Loved it!",
    author: "Anna Marios",
    role: "Creative Director",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  }
];

export const megaMenuData = {
  birthday: {
    title: "Birthday Gifts",
    sections: [
      {
        heading: "For Him",
        links: [
          { name: "Husband", url: "/shop?cat=birthday&for=husband" },
          { name: "Boyfriend", url: "/shop?cat=birthday&for=boyfriend" },
          { name: "Father", url: "/shop?cat=birthday&for=father" },
          { name: "Brother", url: "/shop?cat=birthday&for=brother" }
        ]
      },
      {
        heading: "For Her",
        links: [
          { name: "Wife", url: "/shop?cat=birthday&for=wife" },
          { name: "Girlfriend", url: "/shop?cat=birthday&for=girlfriend" },
          { name: "Mother", url: "/shop?cat=birthday&for=mother" },
          { name: "Sister", url: "/shop?cat=birthday&for=sister" }
        ]
      },
      {
        heading: "For Kids",
        links: [
          { name: "Boys", url: "/shop?cat=birthday&for=boys" },
          { name: "Girls", url: "/shop?cat=birthday&for=girls" },
          { name: "Infants", url: "/shop?cat=birthday&for=infants" },
          { name: "Teens", url: "/shop?cat=birthday&for=teens" }
        ]
      },
      {
        heading: "By Age",
        links: [
          { name: "1st Birthday", url: "/shop?cat=birthday&age=1" },
          { name: "18th Birthday", url: "/shop?cat=birthday&age=18" },
          { name: "21st Birthday", url: "/shop?cat=birthday&age=21" },
          { name: "50th Birthday", url: "/shop?cat=birthday&age=50" }
        ]
      }
    ]
  },
  anniversary: {
    title: "Anniversary Gifts",
    sections: [
      {
        heading: "By Milestone",
        links: [
          { name: "1st Anniversary", url: "/shop?cat=anniversary&year=1" },
          { name: "5th Anniversary", url: "/shop?cat=anniversary&year=5" },
          { name: "10th Anniversary", url: "/shop?cat=anniversary&year=10" },
          { name: "25th Silver", url: "/shop?cat=anniversary&year=25" }
        ]
      },
      {
        heading: "For Couples",
        links: [
          { name: "Photo Frames", url: "/shop?cat=couples-frames" },
          { name: "Custom Mugs", url: "/shop?cat=couples-mugs" },
          { name: "Home Decor", url: "/shop?cat=couples-decor" }
        ]
      },
      {
        heading: "For Husband",
        links: [
          { name: "Wallets", url: "/shop?cat=wallets" },
          { name: "Watches", url: "/shop?cat=watches" },
          { name: "Personalized Pens", url: "/shop?cat=pens" }
        ]
      },
      {
        heading: "For Wife",
        links: [
          { name: "Jewelry Boxes", url: "/shop?cat=jewelry-boxes" },
          { name: "Perfumes", url: "/shop?cat=perfumes" },
          { name: "Custom Bags", url: "/shop?cat=custom-bags" }
        ]
      }
    ]
  },
  occasion: {
    title: "Gifts by Occasion",
    sections: [
      {
        heading: "Romantic",
        links: [
          { name: "Valentine's Day", url: "/shop?cat=valentines" },
          { name: "Proposals", url: "/shop?cat=proposals" },
          { name: "Date Nights", url: "/shop?cat=date-nights" }
        ]
      },
      {
        heading: "Family Events",
        links: [
          { name: "Mother's Day", url: "/shop?cat=mothers-day" },
          { name: "Father's Day", url: "/shop?cat=fathers-day" },
          { name: "Baby Showers", url: "/shop?cat=baby-showers" }
        ]
      },
      {
        heading: "Celebrations",
        links: [
          { name: "Housewarming", url: "/shop?cat=housewarming" },
          { name: "Graduation", url: "/shop?cat=graduation" },
          { name: "Retirement", url: "/shop?cat=retirement" }
        ]
      },
      {
        heading: "Festivals",
        links: [
          { name: "Christmas", url: "/shop?cat=christmas" },
          { name: "New Year", url: "/shop?cat=new-year" },
          { name: "Diwali / Eid", url: "/shop?cat=festivals" }
        ]
      }
    ]
  },
  relationship: {
    title: "Gifts by Relationship",
    sections: [
      {
        heading: "Partners",
        links: [
          { name: "Husband / Wife", url: "/shop?cat=partners" },
          { name: "Boyfriend / Girlfriend", url: "/shop?cat=boy-girl" },
          { name: "Fiancé / Fiancée", url: "/shop?cat=fiance" }
        ]
      },
      {
        heading: "Immediate Family",
        links: [
          { name: "Mom / Dad", url: "/shop?cat=parents" },
          { name: "Brother / Sister", url: "/shop?cat=siblings" },
          { name: "Son / Daughter", url: "/shop?cat=children" }
        ]
      },
      {
        heading: "Extended Family",
        links: [
          { name: "Grandparents", url: "/shop?cat=grandparents" },
          { name: "Aunts / Uncles", url: "/shop?cat=relatives" },
          { name: "Cousins", url: "/shop?cat=cousins" }
        ]
      },
      {
        heading: "Friends & Work",
        links: [
          { name: "Best Friends", url: "/shop?cat=friends" },
          { name: "Colleagues", url: "/shop?cat=colleagues" },
          { name: "Boss / Manager", url: "/shop?cat=boss" }
        ]
      }
    ]
  }
};

export const dealsAndCollectionsData = {
  newCollection: [
    {
      id: 201,
      name: "Personalised Photo Frame",
      cat_name: "Home Decor",
      price: 449,
      old_price: 699,
      rating: 5,
      reviews_count: 120,
      image_url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 202,
      name: "Custom Name Mug",
      cat_name: "Cups & Mugs",
      price: 299,
      old_price: 599,
      rating: 5,
      reviews_count: 98,
      image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 203,
      name: "LED Photo Lamp",
      cat_name: "Home Decor",
      price: 999,
      old_price: 1299,
      rating: 5,
      reviews_count: 76,
      image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 204,
      name: "Personalised Keychain",
      cat_name: "Accessories",
      price: 199,
      old_price: 399,
      rating: 5,
      reviews_count: 64,
      image_url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=400&q=80"
    }
  ],
  topRated: [
    {
      id: 205,
      name: "Couple Photo Frame",
      cat_name: "Photo Frames",
      price: 499,
      old_price: 699,
      rating: 5,
      reviews_count: 112,
      image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 206,
      name: "Personalised T-Shirt",
      cat_name: "T-Shirts",
      price: 499,
      old_price: 699,
      rating: 5,
      reviews_count: 98,
      image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 207,
      name: "Acrylic Name Lamp",
      cat_name: "Home Decor",
      price: 899,
      old_price: 1199,
      rating: 5,
      reviews_count: 84,
      image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 208,
      name: "Custom Water Bottle",
      cat_name: "Drinkware",
      price: 399,
      old_price: 649,
      rating: 5,
      reviews_count: 72,
      image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80"
    }
  ],
  bestSellers: [
    {
      id: 209,
      name: "Magic Photo Mug",
      cat_name: "Cups & Mugs",
      price: 349,
      old_price: 699,
      rating: 5,
      reviews_count: 148,
      image_url: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 210,
      name: "Personalised Cushion",
      cat_name: "Home Decor",
      price: 599,
      old_price: 799,
      rating: 5,
      reviews_count: 109,
      image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 211,
      name: "Wooden Engraved Frame",
      cat_name: "Photo Frames",
      price: 449,
      old_price: 699,
      rating: 5,
      reviews_count: 96,
      image_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 212,
      name: "Custom Couple Lamp",
      cat_name: "Home Decor",
      price: 999,
      old_price: 1299,
      rating: 5,
      reviews_count: 90,
      image_url: "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=400&q=80"
    }
  ]
};

