import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus, Quote, ChevronRight, Sprout, ShieldCheck, TrendingUp, Users, ArrowRight, CheckCircle2, Wheat, Store, BarChart3, Truck, Mail, MapPin, Search, Globe, Layout, Shield } from "lucide-react";
import heroMaize from "@/assets/hero-maize.png";
import vegetablesImage from "@/assets/vegetable-basket.png";
import farmerMale from "@/assets/farmer-male.png";
import farmerFemale from "@/assets/farmer-female.png";
import team3 from "@/assets/team-3.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const CountUp = ({ end, decimals = 0, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(progress * end);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
};

const TrustedBy = () => {
  const logos = ["GreenFarm", "AgriBoost", "EcoHarvest", "PureSoil", "FarmTrack", "AgroLogic"];
  return (
    <div className="bg-white/50 border-y border-primary/5 py-12 relative overflow-hidden group">
      <div className="flex animate-scroll whitespace-nowrap">
        {[...logos, ...logos, ...logos].map((logo, i) => (
          <div key={i} className="flex items-center gap-2 mx-12 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sprout className="h-4 w-4 text-primary" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground tracking-tight">{logo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Navbar = () => (
  <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
    <div className="bg-background/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-elevated">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-primary p-1.5 rounded-lg group-hover:scale-110 transition-transform">
          <Sprout className="h-5 w-5 text-white" />
        </div>
        <span className="font-heading text-lg font-bold text-foreground tracking-tight">AgriLinkChain</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <a href="#solutions" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Solutions</a>
        <a href="#gallery" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Marketplace</a>
        <a href="#stats" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Impact</a>
        <a href="#testimonials" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Stories</a>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/login" className="hidden sm:block">
          <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary rounded-full">Explore</Button>
        </Link>
        <Link to="/signup">
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-glow">
            Join Platform
          </Button>
        </Link>
      </div>
    </div>
  </nav>
);

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className="relative min-h-[95vh] flex items-center justify-start pt-20 overflow-hidden">
      {/* Background Image with Parallax & Overlay */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <img src={heroMaize} alt="Traditional Farming" className="w-full h-full object-cover scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-5xl text-left">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-[1] mb-8 drop-shadow-2xl"
          >
            Smart Farming for<br />
            <span className="italic font-light text-primary drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">Future Generations</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 max-w-2xl mb-12 leading-relaxed font-medium"
          >
            AgriLinkChain connects farmers directly to global buyers using advanced technology to ensure fair pricing, transparency, and sustainable growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-6"
          >
            <Link to="/signup">
              <Button size="lg" className="h-18 px-12 bg-primary hover:bg-primary/90 text-white text-xl font-bold rounded-2xl shadow-glow gap-3 transition-all hover:scale-105 active:scale-95 group">
                Get Started <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="h-18 px-12 bg-white/10 hover:bg-white/20 border-white/30 text-white text-xl font-bold rounded-2xl backdrop-blur-md transition-all hover:border-primary/50">
                Live Projects
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-20 flex flex-col items-start gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                {[farmerMale, farmerFemale, team3].map((img, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-primary/20 overflow-hidden ring-4 ring-primary/10">
                    <img src={img} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold border-2 border-white ring-4 ring-primary/10">
                  +12K
                </div>
              </div>
              <p className="text-white font-medium text-lg">Trusted by over <span className="text-primary font-bold">12,000+</span> farmers</p>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-8 flex flex-col items-start gap-2 opacity-50"
            >
              <div className="w-1 h-12 rounded-full bg-gradient-to-b from-primary to-transparent" />
              <span className="text-[10px] text-white uppercase tracking-[0.3em] font-bold">Scroll</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const SolutionsSection = () => (
  <section id="solutions" className="py-32 bg-background relative overflow-hidden">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.p variants={fadeInUp} className="text-primary font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-primary" /> Why AgriLinkChain?
          </motion.p>
          <motion.h2 variants={fadeInUp} className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
            Smart Farming in use,<br />
            <span className="text-primary italic">Better Results</span>
          </motion.h2>

          <div className="space-y-6">
            {[
              { icon: Globe, title: "Global Marketplace", desc: "Connect with buyers from across the world without middlemen." },
              { icon: Shield, title: "Secure Transactions", desc: "End-to-end encrypted payments and verified trade agreements." },
              { icon: Layout, title: "Smart Inventory", desc: "Advanced tools to track your harvest and manage stock levels." },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="group flex gap-6 p-6 rounded-3xl hover:bg-white hover:shadow-elevated transition-all border border-transparent hover:border-primary/10"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <item.icon className="h-7 w-7 text-primary group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
            <img src={vegetablesImage} alt="Farm Produce" className="w-full h-[600px] object-cover" />
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

          {/* Floating Card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -right-6 md:right-10 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-elevated border border-white/50 z-20"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Top Seller</p>
                <p className="text-lg font-bold text-foreground">Organic Tomatoes</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
);

const GallerySection = () => (
  <section id="gallery" className="py-32 bg-background/50">
    <div className="container mx-auto px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="text-center mb-20"
      >
        <motion.p variants={fadeInUp} className="text-primary font-bold tracking-widest uppercase mb-4">Our Marketplace</motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
          Vegetables You Grow
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Discover high-quality, verified produce directly from local farms. Pure freshness, every single time.
        </motion.p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[
          { name: "Fresh Organic Carrots", price: "₦1,500/kg", tag: "Organic", img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&h=800&fit=crop" },
          { name: "Bell Peppers Mix", price: "₦2,800/kg", tag: "Hot Deal", img: "https://pickleguys.com/cdn/shop/files/products-pepper-mixed-hot-top1-2.jpg?v=1726705952&width=1920" },
          { name: "Leafy Lettuce", price: "₦900/head", tag: "Fresh", img: "https://images.unsplash.com/photo-1556781366-336f8353ba7c?q=80&w=600&h=800&fit=crop" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-card group-hover:shadow-elevated transition-all duration-500">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-6 left-6">
                <span className="bg-primary px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg uppercase tracking-wider">
                  {item.tag}
                </span>
              </div>

              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-primary font-bold">{item.price}</p>
                  <Button size="sm" variant="ghost" className="text-white hover:text-primary p-0 h-auto gap-1">
                    Order Now <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="absolute -bottom-4 right-10 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-elevated opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <Plus className="h-6 w-6" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeInUp} className="mt-20 text-center">
        <Link to="/marketplace">
          <Button size="lg" variant="outline" className="rounded-full px-10 border-primary text-primary hover:bg-primary hover:text-white transition-all">
            Browse All Products
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

const StatsSection = () => (
  <section id="stats" className="py-20 bg-primary text-white">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
        {[
          { label: "Farmers Onboarded", val: 0.3, suffix: "M+", decimals: 1 },
          { label: "Daily Transactions", val: 1.2, suffix: "B+", prefix: "₦", decimals: 1 },
          { label: "Active Buyers", val: 45, suffix: "K+" },
          { label: "Communities Reached", val: 2500, suffix: "+" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
              {stat.prefix}<CountUp end={stat.val} decimals={stat.decimals || 0} />{stat.suffix}
            </p>
            <p className="text-white/70 text-sm font-medium uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section id="testimonials" className="py-32 bg-background">
    <div className="container mx-auto px-4 text-center">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-20">
        <motion.p variants={fadeInUp} className="text-primary font-bold tracking-widest uppercase mb-4">Real Stories</motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-4xl font-bold text-foreground">
          By Our Farmers
        </motion.h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {[
          {
            name: "Ibrahim Musa",
            role: "Rice Farmer, Jigawa",
            img: farmerMale,
            text: "AgriLinkChain changed my life. I used to sell to middlemen who took 40% of my profit. Now I sell directly and earn almost double."
          },
          {
            name: "Aisha Bello",
            role: "Cocoa Producer, Osun",
            img: farmerFemale,
            text: "The transparency and ease of payment are what I love most. I can track every kilo of cocoa from my farm to the buyer."
          },
        ].map((story, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[3rem] shadow-card border border-primary/5 text-left relative overflow-hidden group hover:shadow-elevated transition-all"
          >
            <Quote className="absolute top-8 right-10 h-16 w-16 text-primary/5 group-hover:text-primary/10 transition-colors" />
            <div className="flex items-center gap-6 mb-8">
              <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-lg">
                <img src={story.img} alt={story.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-heading text-xl font-bold text-foreground">{story.name}</h4>
                <p className="text-primary font-medium text-sm">{story.role}</p>
              </div>
            </div>
            <p className="text-muted-foreground italic text-lg leading-relaxed">"{story.text}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I register as a farmer?",
      a: "Simply click the 'Join Platform' button, select 'I'm a Farmer', and fill in your details. You'll need to verify your phone number and location to start listing products."
    },
    {
      q: "How are prices determined?",
      a: "Prices on AgriLinkChain are determined by the farmers themselves based on current market trends. Our smart pricing tool also provides recommendations to help farmers stay competitive."
    },
    {
      q: "Is the payment system secure?",
      a: "Yes, we use an escrow system. Payments are held securely by AgriLinkChain and only released to the farmer once the buyer confirms receipt of the goods in the specified condition."
    },
    {
      q: "Do you offer delivery services?",
      a: "We partner with trusted logistics providers across the country. Buyers can choose their preferred delivery method or arrange for self-pickup from verified local hubs."
    },
    {
      q: "What happens if there's a dispute?",
      a: "Our dedicated support team handles all disputes. If a shipment is rejected for quality reasons, our verification agents inspect the produce and facilitate refunds or replacements accordingly."
    }
  ];

  return (
    <section className="py-32 bg-background/50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="font-heading text-4xl font-bold text-foreground">
            Frequently asked questions
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className={`bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden ${openIndex === i ? "border-primary shadow-lg" : "border-primary/5 hover:border-primary/20"}`}
            >
              <div className="p-6 flex items-center justify-between">
                <span className={`font-bold transition-colors ${openIndex === i ? "text-primary" : "text-foreground"}`}>{faq.q}</span>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${openIndex === i ? "bg-primary" : "bg-primary/5"}`}>
                  {openIndex === i ? <Minus className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-primary" />}
                </div>
              </div>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="bg-[#052e16] rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-bold tracking-[0.3em] uppercase mb-6"
          >
            Clear and Simple
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
          >
            Make farming smarter,<br />
            stronger, and simpler
          </motion.h2>
          <div className="flex justify-center">
            <Link to="/signup?role=agent">
              <Button size="lg" className="h-16 px-12 bg-primary hover:bg-primary/90 text-white text-xl font-bold rounded-2xl shadow-glow">
                Become an Agent
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ContactSection = () => (
  <section className="py-32 bg-background">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <p className="text-primary font-bold tracking-widest uppercase mb-4">Contact Us</p>
          <h2 className="font-heading text-5xl font-bold text-foreground mb-10 leading-tight">
            Let’s Cultivate<br />
            <span className="text-primary italic">Growth Together</span>
          </h2>

          <div className="space-y-8">
            {[
              { icon: Mail, label: "Email", val: "support@agrilinkchain.com" },
              { icon: MapPin, label: "Headquarters", val: "Lagos Agri-Hub, Victoria Island" },
              { icon: Globe, label: "Website", val: "www.agrilinkchain.com" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 group cursor-pointer">
                <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <item.icon className="h-6 w-6 text-primary group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-foreground">{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-[3rem] p-12 shadow-elevated border border-primary/5"
        >
          <form className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">First Name</label>
                <input type="text" placeholder="John" className="w-full bg-primary/5 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Last Name</label>
                <input type="text" placeholder="Doe" className="w-full bg-primary/5 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Email</label>
              <input type="email" placeholder="john@example.com" className="w-full bg-primary/5 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Message</label>
              <textarea placeholder="How can we help you?" rows={4} className="w-full bg-primary/5 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"></textarea>
            </div>
            <Button className="w-full h-16 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-2xl shadow-glow">Send Message</Button>
          </form>
        </motion.div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#1a2c1a] pt-32 pb-12 text-white overflow-hidden relative">
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 border-b border-white/10 pb-20">
        <div className="col-span-1 lg:col-span-1">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-primary p-1.5 rounded-lg">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="font-heading text-2xl font-bold tracking-tight">AgriLinkChain</span>
          </div>
          <p className="text-white/60 text-lg leading-relaxed mb-8">
            The world’s most trusted digital marketplace for local and industrial agriculture.
          </p>
          <div className="flex gap-4">
            {["Twitter", "LinkedIn", "Instagram"].map(social => (
              <div key={social} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all cursor-pointer border border-white/10">
                <span className="sr-only">{social}</span>
                <div className="w-4 h-4 rounded-sm bg-white/20" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading text-xl font-bold mb-8">Navigation</h4>
          <ul className="space-y-4">
            {["Solutions", "Marketplace", "Impact", "Stories", "About Us"].map(item => (
              <li key={item}><a href="#" className="text-white/60 hover:text-primary transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-xl font-bold mb-8">Support</h4>
          <ul className="space-y-4">
            {["Help Center", "Privacy Policy", "Terms of Use", "Shipping", "Returns"].map(item => (
              <li key={item}><a href="#" className="text-white/60 hover:text-primary transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-xl font-bold mb-8">Newsletter</h4>
          <p className="text-white/60 mb-6">Receive the latest updates from our agricultural community.</p>
          <div className="relative">
            <input type="email" placeholder="Email address" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-1 focus:ring-primary outline-none" />
            <button className="absolute right-2 top-2 h-10 px-4 bg-primary text-white rounded-xl text-sm font-bold">Join</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-white/40 text-sm">© 2026 AgriLinkChain. All rights reserved.</p>
        <div className="flex gap-8 text-white/40 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

const AboutDetailSection = () => (
  <section className="py-32 bg-background border-t border-primary/5">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center mb-20">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-primary font-bold tracking-widest uppercase mb-4">Our Mission</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="font-heading text-5xl font-bold text-foreground mb-8">
          Empowering the Future of <span className="text-primary italic">Global Agriculture</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-xl leading-relaxed">
          At AgriLinkChain, we believe that technology can solve the most pressing challenges in the agricultural supply chain. By removing middlemen and providing direct market access, we ensure that farmers receive fair value for their hard work while providing buyers with guaranteed quality and transparency.
        </motion.p>
      </div>

      <div className="flex justify-center gap-8 md:gap-16 flex-wrap">
        {[
          { img: farmerMale, name: "Ibrahim", role: "Co-Founder" },
          { img: farmerFemale, name: "Aisha", role: "Product Lead" },
          { img: team3, name: "Sarah", role: "Chief Agronomist" },
        ].map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center group"
          >
            <div className="h-40 w-40 rounded-2xl overflow-hidden shadow-card mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <h4 className="font-heading text-lg font-bold text-foreground">{p.name}</h4>
            <p className="text-primary text-sm font-medium">{p.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <TrustedBy />
      <SolutionsSection />
      <GallerySection />
      <StatsSection />
      <AboutDetailSection />
      <CTASection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
