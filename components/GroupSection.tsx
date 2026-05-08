"use client";

import { useState } from "react";
import StickerCard from "./StickerCard";
import StickerModal from "./StickerModal";
import { STICKERS_PER_TEAM } from "@/lib/data";

interface GroupSectionProps {
  groupName: string;
  teams: Array<{ code: string; name: string; flag: string }>;
  collectedMap: Record<string, boolean>;
  imageCache?: Record<string, string | null>;
  onToggle?: (teamCode: string, number: number) => Promise<void>;
  readOnly?: boolean;
  nums?: number[]; // para seções especiais (FWC, CC)
}

export default function GroupSection({
  groupName,
  teams,
  collectedMap,
  imageCache = {},
  onToggle,
  readOnly = false,
  nums,
}: GroupSectionProps) {
  const [modal, setModal] = useState<{
    teamCode: string;
    teamName: string;
    teamFlag: string;
    number: number;
  } | null>(null);

  // Conta coletadas neste grupo
  const totalInGroup = teams.reduce(
    (acc, t) => acc + (nums ? nums.length : STICKERS_PER_TEAM),
    0
  );
  const collectedInGroup = teams.reduce((acc, team) => {
    const numbers = nums || Array.from({ length: STICKERS_PER_TEAM }, (_, i) => i + 1);
    return acc + numbers.filter((n) => collectedMap[`${team.code}_${n}`]).length;
  }, 0);

  return (
    <section className="mb-10">
      {/* Header do grupo */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bebas text-2xl text-yellow-400 tracking-wide">
          {groupName}
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 font-nunito">
            {collectedInGroup}/{totalInGroup}
          </span>
          <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
              style={{
                width: `${totalInGroup > 0 ? (collectedInGroup / totalInGroup) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Figurinhas por time */}
      {teams.map((team) => {
        const numbers = nums || Array.from({ length: STICKERS_PER_TEAM }, (_, i) => i + 1);
        const teamCollected = numbers.filter((n) => collectedMap[`${team.code}_${n}`]).length;

        return (
          <div key={team.code} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{team.flag}</span>
              <span className="font-bebas text-white text-lg tracking-wide">
                {team.name}
              </span>
              <span className="text-gray-500 text-xs font-nunito ml-auto">
                {teamCollected}/{numbers.length}
              </span>
            </div>

            <div className="grid grid-cols-10 sm:grid-cols-12 lg:grid-cols-14 xl:grid-cols-20 gap-1">
              {numbers.map((num) => {
                const key = `${team.code}_${num}`;
                return (
                  <StickerCard
                    key={key}
                    number={num}
                    teamCode={team.code}
                    teamName={team.name}
                    teamFlag={team.flag}
                    collected={!!collectedMap[key]}
                    imageUrl={imageCache[team.code]}
                    onClick={() =>
                      setModal({
                        teamCode: team.code,
                        teamName: team.name,
                        teamFlag: team.flag,
                        number: num,
                      })
                    }
                    readOnly={readOnly}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Modal */}
      {modal && (
        <StickerModal
          isOpen={true}
          onClose={() => setModal(null)}
          teamCode={modal.teamCode}
          teamName={modal.teamName}
          teamFlag={modal.teamFlag}
          number={modal.number}
          collected={!!collectedMap[`${modal.teamCode}_${modal.number}`]}
          onToggle={
            onToggle
              ? () => onToggle(modal.teamCode, modal.number)
              : undefined
          }
          readOnly={readOnly}
        />
      )}
    </section>
  );
}
