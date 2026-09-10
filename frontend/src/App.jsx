import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // const API = "http://localhost:5000/api/users";
  const API = `${import.meta.env.VITE_API_URL}/api/users`;



  // =========================
  // READ - Get Users
  // =========================
  const fetchData = async () => {
    try {
      const res = await fetch(API);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  // CREATE / UPDATE  // UPDATE - Put API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setMessage("Please fill all fields");
      return;
    }
    try {
      if (editId) {
        const response = await fetch(`${API}/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
          }),
        });

        const updatedUser = await response.json();

        if (response.ok) {
          setData((prevData) =>
            prevData.map((item) =>
              item._id === editId ? updatedUser.user : item
            )
          );
          setMessage("User updated successfully!");
        }
      }

      // CREATE - POST API call
      else {
        const response = await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
          }),
        });

        const newUser = await response.json();
        if (response.ok) {
          setData((prevData) => [...prevData, newUser.user]);
          setMessage("User added successfully!");
        }
      }

      // Reset form
      setName("");
      setEmail("");
      setEditId(null);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong!");
    }
  };

  // EDIT
  const handleEdit = (user) => {
    setEditId(user._id);
    setName(user.name);
    setEmail(user.email);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // DELETE - API call to delete user from MongoDB

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setData((prevData) =>
          prevData.filter((item) => item._id !== id)
        );

        setMessage("User deleted successfully!");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };


  const handleCancel = () => {
    setEditId(null);
    setName("");
    setEmail("");
  };

  // SEARCH
  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(search?.toLowerCase()) ||
    item.email?.toLowerCase().includes(search?.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="fixed left-10 top-10 -z-0 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="fixed bottom-10 right-10 -z-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-2 text-center">
          <h1 className="text-3xl font-extrabold md:text-4xl text-purple-400">
            <span className="text-amber-400">Full Stack</span> CRUD Application • Built with ❤️
          </h1>
        </div>
        <div className="mt-2 text-center">
          <p className="mb-4 text-sm text-slate-500">This application is built with</p>

          <div className="flex flex-wrap justify-center gap-3 mb-3">
            <span className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
              🍃 MongoDB
            </span>
            <span className="rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-medium text-green-300">
              🟢 Node.js
            </span>
            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400">
              ⚛️ React.js
            </span>
            <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-400">
              🎨 Tailwind CSS
            </span>
          </div>
        </div>
        {/* ================= MESSAGE ================= */}
        {message && (
          <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/10 px-5 py-3 text-center text-blue-400">
            {message}
          </div>
        )}

        {/* ================= FORM ================= */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-purple-400">
                {editId ? "✏️ Edit User" : "➕ Add User"}
              </h2>
              <p className="mt-1 text-sm text-slate-200">
                {editId ? "Update user information" : "Create a new user"}
              </p>
            </div>
            <div className="rounded-xl bg-blue-500/10 px-4 py-2 text-sm text-blue-400">Total: {data.length}</div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-3"
          >
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 font-semibold transition hover:scale-[1.02] hover:from-blue-400 hover:to-purple-500"
              >
                {editId ? "Update User" : "Add User"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl bg-slate-700 px-5 py-3 font-semibold transition hover:bg-slate-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none backdrop-blur-xl transition placeholder:text-slate-500 focus:border-blue-500"
          />
        </div>

        {/* ================= USER LIST ================= */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-purple-400">👥 Users</h2>
              <p className="text-sm text-slate-200">Manage your users</p>
            </div>
            <span className="rounded-full bg-purple-500/10 px-4 py-2 text-sm text-purple-400">
              {filteredData.length} Users
            </span>
          </div>

          {/* Empty */}
          {filteredData.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <div className="mb-3 text-5xl">👤</div>
              <h3 className="font-semibold text-slate-300">No users found</h3>
              <p className="mt-1 text-sm text-slate-500">Try adding a new user.</p>
            </div>
          ) : (

            <div className="space-y-3">
              {filteredData.map((item) => (
                <div
                  key={item._id}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-900/70 p-4 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-slate-800 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold">{item.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="text-sm text-slate-400">{item.email}</p>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="rounded-xl bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500 hover:text-white"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;