export function Logo({ className = "w-48 h-48" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 200 200"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Open Book Base */}
            <g id="book">
                {/* Book shadow */}
                <ellipse cx="100" cy="165" rx="60" ry="8" fill="#4A3728" opacity="0.1" />

                {/* Left page */}
                <path
                    d="M 40 140 Q 40 135 45 132 L 95 130 L 95 160 L 45 162 Q 40 159 40 154 Z"
                    fill="#FFFFFF"
                    stroke="#A47764"
                    strokeWidth="2"
                />
                <path
                    d="M 50 138 L 85 138 M 50 143 L 85 143 M 50 148 L 85 148 M 50 153 L 80 153"
                    stroke="#E8DFD8"
                    strokeWidth="1.5"
                />

                {/* Right page */}
                <path
                    d="M 105 130 L 155 132 Q 160 135 160 140 L 160 154 Q 160 159 155 162 L 105 160 Z"
                    fill="#FFFFFF"
                    stroke="#A47764"
                    strokeWidth="2"
                />
                <path
                    d="M 115 138 L 150 138 M 115 143 L 150 143 M 115 148 L 150 148 M 120 153 L 150 153"
                    stroke="#E8DFD8"
                    strokeWidth="1.5"
                />

                {/* Book spine */}
                <rect x="98" y="130" width="4" height="32" fill="#8B6F47" rx="1" />
            </g>

            {/* Tree Trunk */}
            <g id="trunk">
                <rect x="94" y="80" width="12" height="52" fill="#6B4E3D" rx="2" />
                <rect x="96" y="82" width="8" height="48" fill="#8B6F47" opacity="0.3" />
            </g>

            {/* Microphone integrated into trunk */}
            <g id="microphone">
                {/* Mic body */}
                <ellipse cx="100" cy="95" rx="10" ry="14" fill="#2D5F5D" />
                <ellipse cx="100" cy="95" rx="7" ry="11" fill="#3D7D75" />

                {/* Mic grille lines */}
                <line x1="95" y1="90" x2="105" y2="90" stroke="#1C1410" strokeWidth="0.5" opacity="0.3" />
                <line x1="95" y1="93" x2="105" y2="93" stroke="#1C1410" strokeWidth="0.5" opacity="0.3" />
                <line x1="95" y1="96" x2="105" y2="96" stroke="#1C1410" strokeWidth="0.5" opacity="0.3" />
                <line x1="95" y1="99" x2="105" y2="99" stroke="#1C1410" strokeWidth="0.5" opacity="0.3" />

                {/* Voice waves */}
                <path d="M 85 88 Q 83 95 85 102" stroke="#2D5F5D" strokeWidth="2" fill="none" opacity="0.6" />
                <path d="M 80 85 Q 77 95 80 105" stroke="#2D5F5D" strokeWidth="1.5" fill="none" opacity="0.4" />
                <path d="M 115 88 Q 117 95 115 102" stroke="#2D5F5D" strokeWidth="2" fill="none" opacity="0.6" />
                <path d="M 120 85 Q 123 95 120 105" stroke="#2D5F5D" strokeWidth="1.5" fill="none" opacity="0.4" />
            </g>

            {/* Tree - Three Layers of Leaves */}
            <g id="leaves">
                {/* Bottom Layer - Mocha Brown */}
                <ellipse cx="65" cy="75" rx="18" ry="10" fill="#A47764" transform="rotate(-35 65 75)" />
                <ellipse cx="135" cy="75" rx="18" ry="10" fill="#A47764" transform="rotate(35 135 75)" />
                <ellipse cx="80" cy="72" rx="15" ry="9" fill="#8B6F47" transform="rotate(-20 80 72)" />
                <ellipse cx="120" cy="72" rx="15" ry="9" fill="#8B6F47" transform="rotate(20 120 72)" />
                <ellipse cx="100" cy="70" rx="14" ry="8" fill="#6B4E3D" />

                {/* Middle Layer - Teal Accent */}
                <ellipse cx="70" cy="58" rx="16" ry="9" fill="#2D5F5D" transform="rotate(-30 70 58)" />
                <ellipse cx="130" cy="58" rx="16" ry="9" fill="#2D5F5D" transform="rotate(30 130 58)" />
                <ellipse cx="85" cy="55" rx="13" ry="8" fill="#3D7D75" transform="rotate(-15 85 55)" />
                <ellipse cx="115" cy="55" rx="13" ry="8" fill="#3D7D75" transform="rotate(15 115 55)" />
                <ellipse cx="100" cy="52" rx="12" ry="7" fill="#4D8D85" />

                {/* Top Layer - Mocha Brown */}
                <ellipse cx="80" cy="42" rx="14" ry="8" fill="#A47764" transform="rotate(-25 80 42)" />
                <ellipse cx="120" cy="42" rx="14" ry="8" fill="#A47764" transform="rotate(25 120 42)" />
                <ellipse cx="95" cy="38" rx="11" ry="7" fill="#8B6F47" transform="rotate(-10 95 38)" />
                <ellipse cx="105" cy="38" rx="11" ry="7" fill="#8B6F47" transform="rotate(10 105 38)" />
                <ellipse cx="100" cy="32" rx="10" ry="6" fill="#6B4E3D" />
            </g>
        </svg>
    );
}
