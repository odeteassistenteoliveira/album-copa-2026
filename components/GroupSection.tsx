"use client";

import { useState } from "react";
import StickerCard from "./StickerCard";
import StickerModal from "./StickerModal";
import { STICKERS_PER_TEAM } from "@/lib/data";

interface GroupSectionProps {
  groupName: string;
  teams: Array<{ code: string; name: string; flag: string }>;
  quantityMap: Record<string, number>;
  
  onToggle?: (teamCode: string, number: number) => Promise<void>;
  onQuantityChange?: (teamCode: string, number: number, delta: number) => Promise<void>;
  readOnly?: boolean;
  nums?: number[];
}

export default function GroupSection({
  groupName,
  teams,
  quantityMap,
  
  onToggle,
  onQuantityChange,
  readOnly = false,
  nums,
}: GroupSectionProps) {
  const [modal, setModal] = useState<{
    teamCode: string; teamName: string; teamFlag: string; number: number;
  } | null>(null);

  const totalInGroup = teams.reduce((acc) => acc + (nums ? nums.length : STICKERS_PER_TEAM), 0);
  const collectedInGroup = teams.reduce((acc, team) => {
    const numbers = nums || Array.from({ length: STICKERS_PER_TEAM }, (_, i) => i + 1);
    return acc + numbers.filter((n) => (quantityMap[`${team.code}_${n}`] ?? 0) >= 1).length;
  }, 0);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bebas text-2xl text-yellow-400 tracking-wide">{groupName}</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 font-nunito">{collectedInGroup}/{totalInGroup}</span>
          <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${totalInGroup > 0 ? (collectedInGroup / totalInGroup) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {teams.map((team) => {
        const numbers = nums || Array.from({ length: STICKERS_PER_TEAM }, (_, i) => i + 1);
        const teamCollected = numbers.filter((n) => (quantityMap[`${team.code}_${n}`] ?? 0) >= 1).length;
        const teamDupes = numbers.filter((n) => (quantityMap[`${team.code}_${n}`] ?? 0) >= 2).length;

        return (
          <div key={team.code} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{team.flag}</span>
              <span className="font-bebas text-white text-lg tracking-wide">{team.name}</span>
              <div className="ml-auto flex items-center gap-2">
                {teamDupes > 0 && (
                  <span className="bg-blue-900/40 border border-blue-700/40 text-blue-400 text-xs font-nunito px-2 py-0.5 rounded-full">
                    {teamDupes} rep.
                  </span>
                )}
                <span className="text-gray-500 text-xs font-nunito">{teamCollected}/{numbers.length}</span>
              </div>
            </div>

            <div className="grid grid-cols-10 sm:grid-cols-12 lg:grid-cols-14 xl:grid-cols-20 gap-1">
              {numbers.map((num) => {
                const key = `${team.code}_${num}`;
                const qty = quantityMap[key] ?? 0;
                return (
                  <StickerCard
                    key={key}
                    number={num}
                    teamCode={team.code}
                    teamName={team.name}
                    teamFlag={team.flag}
                    quantity={qty}
                    
                    onClick={() => setModal({ teamCode: team.code, teamName: team.name, teamFlag: team.flag, number: num })}
                    onQuantityChange={onQuantityChange ? (delta) => onQuantityChange(team.code, num, delta) : undefined}
                    readOnly={readOnly}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {modal && (
        <StickerModal
          isOpen={true}
          onClose={() => setModal(null)}
          teamCode={modal.teamCode}
          teamName={modal.teamName}
          teamFlag={modal.teamFlag}
          number={modal.number}
          collected={(quantityMap[`${modal.teamCode}_${modal.number}`] ?? 0) >= 1}
          onToggle={onToggle ? () => onToggle(modal.teamCode, modal.number) : undefined}
          readOnly={readOnly}
        />
      )}
    </section>
  );
}
