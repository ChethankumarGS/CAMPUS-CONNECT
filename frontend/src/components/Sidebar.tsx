"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-800 text-white w-56 h-[calc(100vh-8rem)] p-4 text-left">
      <ul className="space-y-2">
        <li>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </li>
        {user!.role !== "lecturer" && (
          <li>
            <Link href="/dashboard/courses" className="hover:underline">
              Courses
            </Link>
          </li>
        )}
        <li>
          <Link href="/dashboard/profile" className="hover:underline">
            Profile
          </Link>
        </li>
        {user?.role === "lecturer" && (
          <li>
            <Link href="/dashboard/courses/new" className="hover:underline">
              Create Course
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
