export const metadata = {
  title: "UCollab — License",
};

export default function LicensePage() {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
      <h1 className="text-center text-2xl font-bold select-none">License Agreement</h1>
      
      <div className="mt-8 max-w-3xl w-full bg-base-300 p-8 rounded-lg shadow-2xl">
        <p className="text-accent text-sm mb-4">
          <strong>Last Updated:</strong> March 7th, 2025
        </p>

        <h2 className="text-lg font-semibold">MIT License</h2>
        <p>
          This project is licensed under the <strong>MIT License</strong>. By using this software, you agree to the following terms.
        </p>

        <div className="bg-base-200 p-4 rounded-md text-sm whitespace-pre-wrap border border-gray-600 mt-4">
{`MIT License

Copyright (c) 2024 UCollab Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.`}
        </div>

        <h2 className="text-lg font-semibold mt-6">Usage and Distribution</h2>
        <p>
          This software can be freely used, modified, and distributed under the terms of the MIT License. However, all
          copies of the software must include the original license text.
        </p>

        <h2 className="text-lg font-semibold mt-6">Disclaimer</h2>
        <p>
          This software is provided "as is," without warranty of any kind, express or implied, including but not limited
          to the warranties of merchantability, fitness for a particular purpose, and noninfringement.
        </p>
      </div>
    </div>
  );
}

