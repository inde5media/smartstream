'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'login' | 'signup';
}

export function AuthModal({
  open,
  onOpenChange,
  defaultMode = 'signup',
}: AuthModalProps) {
  const router = useRouter();
  const { signUp, signIn, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!agreeToTerms) {
        newErrors.terms = 'You must agree to the terms and privacy policy';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUp(email, password, name);
        toast.success('Account created! Check your email to verify.');
        onOpenChange(false);
        router.push('/onboarding');
      } else {
        await signIn(email, password);
        toast.success('Welcome back!');
        onOpenChange(false);
        router.push('/discovery');
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to sign in with Google';
      toast.error(message);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setAgreeToTerms(false);
    setErrors({});
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm();
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={mode}
          onValueChange={(v) => {
            setMode(v as 'login' | 'signup');
            resetForm();
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-slate-700"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-slate-700"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-slate-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-slate-800 border-slate-700 text-white"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-slate-300">
                  Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-slate-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-slate-800 border-slate-700 text-white"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password}</p>
                )}
                <p className="text-xs text-slate-500">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="signup-confirm-password"
                  className="text-slate-300"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="signup-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                    disabled={loading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setAgreeToTerms(checked as boolean)
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-slate-400 cursor-pointer"
                >
                  I agree to the{' '}
                  <a href="#" className="text-blue-400 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-400 hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-400">{errors.terms}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={loading || !agreeToTerms}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative my-4">
          <Separator className="bg-slate-700" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-2 text-sm text-slate-500">
            OR
          </span>
        </div>

        <Button
          variant="outline"
          className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
