// import { useState } from 'react';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
// import Drawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';

// const Website = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const navItems = ['Home', 'Services', 'About Us', 'Contact'];

//   const drawer = (
//     <div onClick={handleDrawerToggle}>
//       <List>
//         {navItems.map((item) => (
//           <ListItem button key={item}>
//             <ListItemText primary={item} className="text-sm" />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Navbar */}
//       <AppBar position="static" className="bg-blue-500">
//         <Toolbar>
//           <Typography variant="h6" className="flex-grow text-base">
//             Gawagi Dispensary
//           </Typography>
//           {/* Desktop Navbar */}
//           <div className="hidden md:flex">
//             {navItems.map((item) => (
//               <Button color="inherit" key={item} className="text-sm">
//                 {item}
//               </Button>
//             ))}
//           </div>
//           {/* Mobile Navbar Toggle */}
//           <IconButton
//             color="inherit"
//             edge="start"
//             onClick={handleDrawerToggle}
//             className="md:hidden"
//           >
//             <MenuIcon />
//           </IconButton>
//         </Toolbar>
//       </AppBar>

//       {/* Mobile Drawer */}
//       <Drawer
//         variant="temporary"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{ keepMounted: true }}
//         className="md:hidden"
//       >
//         {drawer}
//       </Drawer>

//       {/* Hero Section */}
//       <main className="flex-grow">
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex flex-col md:flex-row items-center">
//             <div className="md:w-1/2 animate-fadeIn">
//               <h1 className="text-2xl font-bold mb-4">
//                 Welcome to <span className="text-blue-500">Gawagi Dispensary</span>
//               </h1>
//               <p className="text-gray-700 mb-4 text-xs">
//                 We provide the best healthcare services with state-of-the-art facilities and experienced professionals.
//               </p>
//               <button className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 text-xs">
//                 Learn More
//               </button>
//             </div>
//             <div className="md:w-1/2 mt-8 md:mt-0 animate-slideIn">
//               <img
//                 src="/images/img1.jpg" // Replace with img1, img2, etc.
//                 alt="Hospital Services"
//                 className="rounded-lg shadow-lg w-full"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Additional Images Section */}
//         <div className="container mx-auto px-4 py-8">
//           <h2 className="text-xl font-bold mb-4 text-center">Our Facilities</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <img
//               src="/images/img2.jpg"
//               alt="Facility 1"
//               className="rounded-lg shadow-lg w-full h-48 object-cover"
//             />
//             <img
//               src="/images/img3.jpg"
//               alt="Facility 2"
//               className="rounded-lg shadow-lg w-full h-48 object-cover"
//             />
//             <img
//               src="/images/img4.jpg"
//               alt="Facility 3"
//               className="rounded-lg shadow-lg w-full h-48 object-cover"
//             />
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white text-center p-4 mt-8">
//         <p className="text-xs">&copy; 2023 Gawagi Dispensary. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Website;