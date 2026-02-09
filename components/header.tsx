import { BookAIcon } from 'lucide-react';
import React from 'react';

function Header() {
    return (
        <div className='flex bg-[#faf9f9] border-b border-border items-center gap-2 px-6 py-4 sticky top-0 z-10'>
            <BookAIcon className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Biblio</h1>
        </div>
    );
}

export default Header;