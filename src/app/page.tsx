import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProductCard } from '@/components/product-card'
import Link from 'next/link'
import { ArrowRight, Sparkles, Truck, Shield, Clock } from 'lucide-react'

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    include: { images: true },
    take: 8,
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-jade-900 opacity-95" />
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center mix-blend-overlay opacity-20" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6 animate-fade-in">
            Welcome to <span className="text-gradient">JadePocketShop</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
            Discover luxury in every detail
          </p>
          
          {products.length > 0 ? (
            <Link href="/shop">
              <Button size="lg" className="text-lg px-8 py-6 jade-glow">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <div className="space-y-6">
              <div className="glass p-8 rounded-2xl max-w-md mx-auto">
                <Sparkles className="h-12 w-12 text-jade mx-auto mb-4" />
                <h2 className="text-2xl font-playfair text-white mb-3">Coming Soon</h2>
                <p className="text-white/80 mb-6">
                  Be the first to know when we launch our exclusive collection
                </p>
                <form className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button type="submit" variant="default">
                    Notify Me
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="h-16 w-16 rounded-full bg-jade/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-jade/20 transition-colors">
              <Truck className="h-8 w-8 text-jade" />
            </div>
            <h3 className="text-xl font-playfair font-semibold mb-2">Free Shipping</h3>
            <p className="text-charcoal-600">On orders over $50</p>
          </div>
          <div className="text-center group">
            <div className="h-16 w-16 rounded-full bg-jade/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-jade/20 transition-colors">
              <Shield className="h-8 w-8 text-jade" />
            </div>
            <h3 className="text-xl font-playfair font-semibold mb-2">Secure Payment</h3>
            <p className="text-charcoal-600">100% secure transactions</p>
          </div>
          <div className="text-center group">
            <div className="h-16 w-16 rounded-full bg-jade/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-jade/20 transition-colors">
              <Clock className="h-8 w-8 text-jade" />
            </div>
            <h3 className="text-xl font-playfair font-semibold mb-2">30-Day Returns</h3>
            <p className="text-charcoal-600">Easy returns policy</p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      {products.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-playfair font-bold text-center mb-12">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/shop">
                <Button size="lg" variant="outline">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
