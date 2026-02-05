import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { itemVariants } from "../../utils/animations";
import LabeledInput from "../common/LabeledInput";
import MailBackButton from "../../pages/mail/BackButton";
import MailPage from "../../pages/mail/MailPage";

const CreateTemplateView = ({ onSave, onCancel, colors, isSaving = false }) => {
  const [template, setTemplate] = useState({ name: "", subject: "", body: "" });

  const handleSave = () => {
    if (!template.name || !template.body) {
      toast.error("Please fill required fields");
      return;
    }
    onSave(template);
    toast.success("Template saved!");
  };

  const variableMatches = [...`${template.body} ${template.subject}`.matchAll(/{{(.*?)}}/g)]
    .map((match) => match[1])
    .filter(Boolean);
  const variables = [...new Set(variableMatches)];

  return (
    <MailPage>
      <MailBackButton onClick={onCancel} />
      <div className="space-y-4">
        <LabeledInput
          label="Template Name"
          value={template.name}
          onChange={(e) => setTemplate({ ...template, name: e.target.value })}
          inputClassName={colors.input}
        />
        <LabeledInput
          label="Subject Line"
          value={template.subject}
          onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
          inputClassName={colors.input}
        />
        <div>
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
            Body
          </label>
          <textarea
            className={`w-full h-64 p-3 rounded-xl text-sm font-mono leading-relaxed ${colors.input}`}
            value={template.body}
            onChange={(e) => setTemplate({ ...template, body: e.target.value })}
          />
        </div>
        <div className={`p-4 rounded-2xl border ${colors.card}`}>
          <h4 className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-2">
            Template Variables
          </h4>
          {variables.length === 0 ? (
            <p className="text-xs opacity-60">No variables found.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {variables.map((variable) => (
                <span
                  key={variable}
                  className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-gray-200 dark:border-zinc-700"
                >
                  {variable}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-3 rounded-xl font-bold text-sm ${colors.primary}`}
        >
          {isSaving ? "Saving..." : "Save Template"}
        </button>
      </div>
    </MailPage>
  );
};

export default CreateTemplateView;
