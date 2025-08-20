import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { MAIN_BACKEND_URL } from "../Scripts/URL";
import { useNavigate } from "react-router-dom";

interface props {
  id: string;
}

const DropdownMenu = ({ id }: props) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    const deletedResponse = await fetch(`${MAIN_BACKEND_URL}/uploadPost/remove-story/${id}`, { method: "DELETE" });
    if (deletedResponse.ok) {
      navigate(-1);
    }
    setIsOpen(false);
  };

  const handleInfo = () => {
    alert("Info clicked");
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <MoreVertical size={22} color="white" />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "28px",
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 100,
            minWidth: "140px",
            overflow: "hidden",
          }}
        >
          <div onClick={handleDelete} style={menuItemStyle}>
            Remove
          </div>
          <div onClick={handleInfo} style={menuItemStyle}>
            Info!
          </div>
        </div>
      )}
    </div>
  );
};

const menuItemStyle: React.CSSProperties = {
  padding: "10px 16px",
  cursor: "pointer",
  fontSize: "14px",
  color: "#333",
  transition: "background 0.2s",
  whiteSpace: "nowrap",
};

export default DropdownMenu;
