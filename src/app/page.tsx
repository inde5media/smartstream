'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  Mic,
  Sparkles,
  Zap,
  Layers,
  Play,
  Check,
  ChevronRight,
  User,
  Brain,
  Rocket,
} from 'lucide-react';

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const openSignup = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">StreamSmart</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-slate-300" onClick={openLogin}>
                Sign In
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={openSignup}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20">
            AI-Powered Discovery
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Stop Scrolling.{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Start Watching.
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            AI voice assistant finds your perfect show in 60 seconds — across ALL
            your streaming platforms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8"
              onClick={openSignup}
            >
              <Mic className="w-5 h-5 mr-2" />
              Try Alex Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 text-lg px-8"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Demo Video Placeholder */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="aspect-video rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
                <p className="text-slate-400">Demo Video Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              The 45-Minute Scroll Problem
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Every night, millions waste precious time deciding what to watch.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Too Many Choices
                </h3>
                <p className="text-slate-400">
                  Average user scrolls for 45 minutes before deciding what to watch.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Scattered Platforms
                </h3>
                <p className="text-slate-400">
                  Content spread across 5+ services with no unified search.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Keyword Hell
                </h3>
                <p className="text-slate-400">
                  Search doesn&apos;t understand &quot;something uplifting after a long day.&quot;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Meet Alex, Your AI Discovery Guide
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Natural conversation finds what you actually want to watch.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Voice OR Avatar
                </h3>
                <p className="text-slate-400 text-sm">
                  Choose your experience: visual avatar or quick voice-only mode.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Semantic Search
                </h3>
                <p className="text-slate-400 text-sm">
                  Understands meaning, not keywords. 96x faster than traditional search.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Cross-Platform
                </h3>
                <p className="text-slate-400 text-sm">
                  Searches Netflix, TV5, HBO, Disney+ in one query.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  One-Tap Launch
                </h3>
                <p className="text-slate-400 text-sm">
                  Go from &quot;what to watch&quot; to watching in seconds.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Choose Your Experience
            </h2>
            <p className="text-slate-400">Start free, upgrade when you love it.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                  <div className="text-4xl font-bold text-white">
                    $0<span className="text-lg text-slate-400">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    10 voice queries per month
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    All streaming platforms
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    Voice-only mode
                  </li>
                  <li className="flex items-center gap-2 text-slate-500">
                    <ChevronRight className="w-5 h-5" />
                    No avatar mode
                  </li>
                </ul>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={openSignup}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600">
                Most Popular
              </Badge>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="text-4xl font-bold text-white">
                    $7.99<span className="text-lg text-slate-400">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    Unlimited voice queries
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    All streaming platforms
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    Avatar mode with Alex
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    Priority support
                  </li>
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={openSignup}
                >
                  Start 7-Day Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Stop Scrolling?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join thousands finding the perfect show in seconds, not hours.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8"
            onClick={openSignup}
          >
            <Mic className="w-5 h-5 mr-2" />
            Try Alex Free — No Credit Card
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">StreamSmart</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition">
                About
              </a>
              <a href="#" className="hover:text-white transition">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition">
                Terms
              </a>
              <a href="#" className="hover:text-white transition">
                Contact
              </a>
            </div>
            <p className="text-sm text-slate-500">
              &copy; 2025 StreamSmart. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultMode={authMode}
      />
    </div>
  );
}
