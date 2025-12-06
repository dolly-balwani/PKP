// src/components/Header.jsx
import { Heart, Shield, Users } from 'lucide-react';

export default function Header() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border shadow-sm" style={{borderColor:'#c8ced1'}}>
        <div className="w-12 h-12 bg-[#3d9098] rounded-xl flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-[#2e2f34]">Sahay docker</h1>
          <p className="text-[#767272] text-sm">Your mental wellness companion</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#767272]">
          <Shield className="w-4 h-4" />
          <span>100% Anonymous</span>
        </div>
      </div>
    </div>
  );
}
