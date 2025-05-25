import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-gray-900 font-medium text-lg">mazeed.ai</Link>
            <p className="text-sm text-gray-500 mt-1">AI CFO for Creators and Influencers</p>
          </div>
          <div className="flex space-x-8">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Contact</a>
          </div>
          <div className="mt-6 md:mt-0">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} mazeed.ai. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
