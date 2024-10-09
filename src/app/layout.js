import { Inter } from "next/font/google";
import "./globals.css";
import Context from "./Context/Context";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Datablocks ",
  description: "Datablocks - A.I Image Generation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Datablocks</title>
        <meta
          name="description"
          content="Unlock the power of Stable Diffusion with our AI design tool. Create, enhance, and upscale designs in seconds with modes like Pencil, Brush, Light, and Texture. Perfect for modern businesses looking to revolutionize their creative process."
        />
        <meta
          name="keywords"
          content="AI design tool, Stable Diffusion, generative AI, image upscaling, design enhancement, Pencil Mode, Brush Mode, Light Mode, Texture Mode, creative AI"
        />
        <meta name="author" content="Aman Ullah" />
        <link rel="icon" href="./assets/logo_horz.png" />
      </head>
      <body className={`${inter.className} text-black`}
      style={{background:'white'}}
      >
        <Context>
          {/* <Navbar /> */}
          {children}
          {/* <Footer /> */}
        </Context>
      </body>
    </html>
  );
}
