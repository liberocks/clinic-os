import type React from "react";

import Button from "../../components/button";
import GhostIcon from "../../components/icons/ghost";
import { ProtectedPage } from "../../components/protected-page";
import { ShowIf } from "../../components/show-if";
import { useLogic } from "./use-logic";

export const MainPage: React.FC = () => {
  const { activeFilter, setActiveFilter, forms, firstName, lastName, handleLogout } = useLogic();

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-2xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-y-2xsmall">
              <h2 className="text-lg font-semibold">Anamnesis Form</h2>
              <p className="text-gray-500 ">List of your clinical anamnesis form</p>
            </div>

            <div className="flex flex-col items-end justify-end">
              <span className="text-base font-semibold text-gray-600">
                {firstName} {lastName}
              </span>
              <button type="button" onClick={handleLogout}>
                <span className="text-sm font-light text-gray-600">Sign out</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div>
            <div className="py-5 sm:py-6">
              <div className="flex space-x-4">
                {["all", "new", "done"].map((filter) => (
                  <button
                    type="button"
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-10 py-2 rounded-full text-sm font-medium bg-gray-200 ${
                      activeFilter === filter ? "bg-emerald-400 text-emerald-800" : "text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ShowIf condition={forms.length === 0}>
            <div className="flex flex-col items-center my-6 space-y-2 rounded-md border  w-full min-h-[150px] justify-center">
              <GhostIcon size={28} className="text-emerald-700" />
              <p className="w-full text-center text-gray-600">No data</p>
            </div>
          </ShowIf>

          {/* Posts */}
          <div className="space-y-6">
            {forms.map((post) => (
              <div key={post.id} className="bg-white border rounded-md">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{post.title}</h3>
                    </div>
                  </div>
                  <p className="mb-4 text-gray-800">{post.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-1 hover:text-emerald-600">
                        <span>{post.created_at}</span>
                      </div>
                    </div>
                    <ShowIf condition={post.status === "new"}>
                      <div className="flex space-x-4">
                        <Button variant="secondary">Give response</Button>
                      </div>
                    </ShowIf>
                    <ShowIf condition={post.status === "done"}>
                      <div className="text-emerald-900">Response sent</div>
                    </ShowIf>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
};
