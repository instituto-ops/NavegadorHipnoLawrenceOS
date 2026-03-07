/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { CheckCircle2, XCircle, Edit3, ShieldAlert } from 'lucide-react';
import React, { useState } from 'react';

interface ActionParam {
  selector?: string;
  text?: string;
  url?: string;
  duration?: number;
}

interface AtomicAction {
  action: string;
  params: ActionParam;
  description: string;
}

interface Plan {
  actions: AtomicAction[];
  requires_hitl?: boolean;
}

interface ActionReviewCardProps {
  plan: Plan;
  onApprove: () => void;
  onReject: () => void;
  onEdit: (editedPlan: Plan) => void;
}

export const ActionReviewCard: React.FC<ActionReviewCardProps> = ({
  plan,
  onApprove,
  onReject,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlanJson, setEditedPlanJson] = useState(JSON.stringify(plan, null, 2));

  const handleSaveEdit = () => {
    try {
      const newPlan = JSON.parse(editedPlanJson);
      onEdit(newPlan);
      setIsEditing(false);
    } catch {
      alert('Invalid JSON format.');
    }
  };

  return (
    <div className="bg-white border-2 border-yellow-400 rounded-xl shadow-lg p-4 mb-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400" />

      <div className="flex items-center gap-2 text-yellow-600 mb-4">
        <ShieldAlert size={24} />
        <h3 className="font-bold text-lg">Action Review Required</h3>
      </div>

      <p className="text-gray-600 text-sm mb-4">
        The LAM has proposed a plan that involves sensitive operations (e.g., spending, posting, or
        messaging). Please review and approve before execution.
      </p>

      {isEditing ? (
        <div className="mb-4">
          <textarea
            className="w-full h-48 font-mono text-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editedPlanJson}
            onChange={(e) => setEditedPlanJson(e.target.value)}
          />
        </div>
      ) : (
        <div className="bg-gray-50 rounded border border-gray-200 p-3 mb-4 max-h-60 overflow-y-auto font-mono text-xs text-gray-800">
          <pre>{JSON.stringify(plan, null, 2)}</pre>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={onReject}
          className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
        >
          <XCircle size={18} />
          Reject
        </button>

        {isEditing ? (
          <button
            onClick={handleSaveEdit}
            className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
          >
            <CheckCircle2 size={18} />
            Save & Approve
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            <Edit3 size={18} />
            Edit Plan
          </button>
        )}

        {!isEditing && (
          <button
            onClick={onApprove}
            className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium transition-colors"
          >
            <CheckCircle2 size={18} />
            Approve
          </button>
        )}
      </div>
    </div>
  );
};
