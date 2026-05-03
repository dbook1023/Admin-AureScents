import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: dbError } = await supabase
        .from('admin_users')
        .select('id, email, display_name, role, password')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (dbError || !data) {
        setError('Invalid email or password.');
        setIsLoading(false);
        return;
      }

      if (data.password !== password) {
        setError('Invalid email or password.');
        setIsLoading(false);
        return;
      }

      // Store admin session info
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('adminUser', JSON.stringify({
        id: data.id,
        email: data.email,
        display_name: data.display_name,
        role: data.role,
      }));

      navigate('/dashboard');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F] overflow-hidden relative font-ui">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#C5A059]/5 rounded-full blur-[150px] -z-5"></div>

      <Card className="w-[360px] glass-card relative z-10 rounded-3xl py-6 px-6 border-white/5 shadow-2xl">
        <CardHeader className="space-y-3 flex flex-col items-center pt-2 pb-2">
          <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center border-white/10 shadow-xl overflow-hidden p-3 group hover:scale-105 hover:bg-white/10 transition-premium bg-white/[0.03]">
             <img src="/ic_logo.png" alt="AureScents Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-serif text-[#C5A059] tracking-[0.2em] uppercase font-black whitespace-nowrap">
              AURE SCENTS
            </h1>
            <div className="h-px w-8 bg-[#C5A059]/20 mx-auto mt-2 rounded-full"></div>
            <p className="text-white/30 font-brand font-black tracking-[0.3em] mt-2 uppercase text-[10px]">
             Login
            </p>
          </div>
        </CardHeader>
        <form onSubmit={handleLogin} className="mt-2">
          <CardContent className="grid gap-4 px-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-[11px] font-brand font-black uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white/40 font-brand font-black text-[10px] uppercase tracking-[0.2em] ml-1 mb-1 block">Email</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/40 group-focus-within:text-[#C5A059] transition-premium" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white/[0.03] border-white/10 text-white !pl-12 h-14 rounded-xl focus-visible:ring-[#C5A059]/30 font-medium placeholder:text-white/20 transition-premium text-sm"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white/40 font-brand font-black text-[10px] uppercase tracking-[0.2em] ml-1 mb-1 block">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/40 group-focus-within:text-[#C5A059] transition-premium" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  className="bg-white/[0.03] border-white/10 text-white !pl-12 !pr-12 h-14 rounded-xl focus-visible:ring-[#C5A059]/30 font-medium transition-premium text-sm"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#C5A059] transition-premium"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-6 px-4 pb-2">
            <Button 
              disabled={isLoading}
              className="w-full glass-button-active h-14 text-[11px] font-black tracking-[0.2em] uppercase rounded-xl shadow-xl transition-premium hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Login'
              )}
            </Button>
            <p className="text-[9px] text-white/20 font-brand font-black tracking-[0.2em] uppercase text-center mt-2">
               Aure Scents Scholarly Archive © 2026
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
