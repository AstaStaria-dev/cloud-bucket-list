import { useState, useEffect, useRef } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";

import { listBucketItems } from "./graphql/queries";
import {
  createBucketItem,
  deleteBucketItem,
  updateBucketItem,
} from "./graphql/mutations";

const client = generateClient();

function App({ signOut, user }) {
  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingImageFile, setEditingImageFile] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const username =
    user.username.charAt(0).toUpperCase() + user.username.slice(1);

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await client.graphql({
        query: listBucketItems,
        authMode: "userPool",
      });

      const resolved = await Promise.all(
        res.data.listBucketItems.items.map(async (i) => {
          if (!i.imageKey) return i;
          try {
            const url = await getUrl({ key: i.imageKey });
            return { ...i, imageUrl: url.url };
          } catch {
            return i;
          }
        })
      );

      resolved.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      setItems(resolved);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  /* ---------------- CREATE ---------------- */

  const addItem = async () => {
    if (!item.trim()) return;

    let imageKey = null;
    let tempImageUrl = null;

    try {
      if (imageFile) {
        imageKey = `bucket-images/${user.username}/${Date.now()}-${imageFile.name}`;

        const uploadResult = await uploadData({
          key: imageKey,
          data: imageFile,
          options: { contentType: imageFile.type },
        }).result;

        const url = await getUrl({ key: uploadResult.key });
        tempImageUrl = url.url;
      }

      const createRes = await client.graphql({
        query: createBucketItem,
        authMode: "userPool",
        variables: {
          input: { title: item, imageKey },
        },
      });

      setItems((prev) => [
        ...prev,
        { ...createRes.data.createBucketItem, imageUrl: tempImageUrl },
      ]);

      setItem("");
      setImageFile(null);
      fileInputRef.current.value = "";
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  /* ---------------- UPDATE ---------------- */

  const updateItem = async (currentItem) => {
    if (!editingTitle.trim()) return;

    let newImageKey = currentItem.imageKey;
    let newImageUrl = currentItem.imageUrl;

    try {
      if (editingImageFile) {
        newImageKey = `bucket-images/${user.username}/${Date.now()}-${editingImageFile.name}`;

        const uploadResult = await uploadData({
          key: newImageKey,
          data: editingImageFile,
          options: { contentType: editingImageFile.type },
        }).result;

        const url = await getUrl({ key: uploadResult.key });
        newImageUrl = url.url;
      }

      await client.graphql({
        query: updateBucketItem,
        authMode: "userPool",
        variables: {
          input: {
            id: editingId,
            title: editingTitle,
            imageKey: newImageKey,
          },
        },
      });

      setItems((prev) =>
        prev.map((i) =>
          i.id === editingId
            ? { ...i, title: editingTitle, imageKey: newImageKey, imageUrl: newImageUrl }
            : i
        )
      );

      setEditingId(null);
      setEditingTitle("");
      setEditingImageFile(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  /* ---------------- DELETE ---------------- */

  const deleteItem = async (id) => {
    try {
      await client.graphql({
        query: deleteBucketItem,
        authMode: "userPool",
        variables: { input: { id } },
      });

      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#A0B2C1] py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-4">
              <img
                src="/bucket-icon.png"
                alt="Bucket List Icon"
                className="w-12 h-12"
              />
              <h1 className="text-4xl font-semibold text-[#2E4057]">
                Bucket List
              </h1>
            </div>

            <p className="mt-2 text-lg text-[#2E4057]/80">
              Welcome, <span className="font-medium">{username}</span>
            </p>
          </div>

          <button
            onClick={signOut}
            className="px-4 py-2 rounded-lg bg-[#2E4057] text-white hover:opacity-90 transition"
          >
            Sign out
          </button>
        </div>

        {/* CREATE */}
        <div className="bg-[#F5F5F5] p-5 rounded-2xl shadow-md mb-10
                        flex flex-col gap-3 sm:flex-row sm:items-center">

          <input
            className="flex-1 rounded-lg px-4 py-2 border
                       focus:outline-none focus:ring-2 focus:ring-[#2E4057]/40"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Add a new goal..."
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 rounded-lg border bg-white text-[#2E4057]
                       hover:bg-gray-50 transition"
          >
            {imageFile ? "Image selected ✓" : "Upload image"}
          </button>

          <button
            onClick={addItem}
            className="bg-[#2E4057] px-6 py-2 rounded-lg
                       text-white hover:opacity-90 transition"
          >
            Add
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-6">
          {items.map((i) => (
            <div key={i.id} className="bg-[#F5F5F5] rounded-2xl shadow-md">
              <div className="p-5">
                {editingId === i.id ? (
                  <>
                    <input
                      className="w-full rounded-lg px-4 py-2 mb-3 border"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                    />

                    {i.imageUrl && (
                      <img
                        src={editingImageFile ? URL.createObjectURL(editingImageFile) : i.imageUrl}
                        alt="preview"
                        className="mb-3 rounded-xl w-full max-h-64 object-cover"
                      />
                    )}

                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditingImageFile(e.target.files[0])}
                      className="hidden"
                    />

                    <button
                      onClick={() => editFileInputRef.current.click()}
                      className="mb-3 px-4 py-2 rounded-lg border bg-white text-[#2E4057]"
                    >
                      Change image
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => updateItem(i)}
                        className="px-5 py-2 rounded-lg bg-white border text-[#2E4057]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditingTitle("");
                          setEditingImageFile(null);
                        }}
                        className="px-5 py-2 rounded-lg border text-[#2E4057]"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-[#2E4057]">
                      {i.title}
                    </h2>

                    {i.imageUrl && (
                      <img
                        src={i.imageUrl}
                        alt={i.title}
                        className="mt-4 rounded-xl w-full max-h-80 object-cover"
                      />
                    )}

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => {
                          setEditingId(i.id);
                          setEditingTitle(i.title);
                        }}
                        className="p-3 rounded-xl bg-white border hover:bg-gray-50"
                      >
                        <i className="fi fi-sr-pencil text-[#2E4057] text-sm"></i>
                      </button>

                      <button
                        onClick={() => deleteItem(i.id)}
                        className="p-3 rounded-xl bg-white border border-red-200 hover:bg-red-50"
                      >
                        <i className="fi fi-sr-trash text-red-500 text-sm"></i>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default withAuthenticator(App);
