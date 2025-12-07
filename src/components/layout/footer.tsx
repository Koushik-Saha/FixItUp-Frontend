'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'iPhone Parts', href: '/products?brand=apple' },
    { name: 'Samsung Parts', href: '/products?brand=samsung' },
    { name: 'Tools', href: '/products?category=tools' },
    { name: 'Accessories', href: '/products?category=accessories' },
  ],
  support: [
    { name: 'Contact Us', href: '/support/contact' },
    { name: 'Shipping Info', href: '/support/shipping' },
    { name: 'Returns & Refunds', href: '/support/returns' },
    { name: 'Warranty', href: '/support/warranty' },
    { name: 'FAQ', href: '/support/faq' },
  ],
  business: [
    { name: 'Apply Now', href: '/auth/business-application' },
    { name: 'Wholesale Pricing', href: '/business/pricing' },
    { name: 'Bulk Orders', href: '/business/bulk-order' },
    { name: 'Terms & Conditions', href: '/business/terms' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Cookie Policy', href: '/legal/cookies' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
]

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-950 text-white dark:border-neutral-800">
      {/* Main Footer */}
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-retail">
                <span className="text-xl font-bold">M</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold">Max Phone Repair</span>
                <span className="text-xs text-neutral-400">
                  Quality Parts for Every Device
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-neutral-400">
              Your trusted source for professional phone repair parts. From screens to batteries, tools to accessories - we've got everything you need.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-retail-primary" />
                <a href="tel:+18005551234" className="hover:text-retail-primary">
                  (800) 555-1234
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-retail-primary" />
                <a
                  href="mailto:support@maxphonerepair.com"
                  className="hover:text-retail-primary"
                >
                  support@maxphonerepair.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-retail-primary" />
                <span>Santa Barbara, CA 93101</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 transition-colors hover:bg-retail-primary"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Links */}
          <div>
            <h3 className="font-semibold">Business Accounts</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.business.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold">Stay Updated</h3>
            <p className="mt-2 text-sm text-neutral-400">
              Get the latest deals and product updates
            </p>
            <form className="mt-4 flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-neutral-800 border-neutral-700"
              />
              <Button variant="retail-primary" type="submit">
                Subscribe
              </Button>
            </form>
            <p className="mt-2 text-xs text-neutral-500">
              By subscribing, you agree to our Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-neutral-400 md:flex-row">
            <p>© 2024 Max Phone Repair. All rights reserved.</p>
            <div className="flex flex-wrap gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
