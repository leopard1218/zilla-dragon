import { Collapse } from "@mui/material";
import { useState } from "react";

export default function FAQItem({ question, answer, ...props }) {
  const [open, setOpen] = useState(false);
  const sentence = answer.split("@@")
  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => setOpen(!open)}>
        {!open ?
          <svg viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26 14C26.5523 14 27 13.5523 27 13C27 12.4477 26.5523 12 26 12L26 14ZM14.5 1C14.5 0.447715 14.0523 -1.97507e-08 13.5 0C12.9477 1.97503e-08 12.5 0.447715 12.5 1L14.5 1ZM0.999999 12C0.447715 12 -5.42532e-07 12.4477 -5.24537e-07 13C-5.06542e-07 13.5523 0.447715 14 1 14L0.999999 12ZM12.5 26C12.5 26.5523 12.9477 27 13.5 27C14.0523 27 14.5 26.5523 14.5 26L12.5 26ZM26 12L13.5 12L13.5 14L26 14L26 12ZM14.5 13L14.5 1L12.5 1L12.5 13L14.5 13ZM13.5 12L0.999999 12L1 14L13.5 14L13.5 12ZM12.5 13L12.5 26L14.5 26L14.5 13L12.5 13Z" fill="white" />
          </svg>
          :
          <svg viewBox="0 0 27 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26 1L1 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        }
        <p>{question}</p>
      </div>
      <div className="faq-answer">
        <Collapse in={open}>
          {sentence.map((item, key) => (
            <p key={key}>{item}</p>
          ))}
        </Collapse>
      </div>
    </div>
  )
}