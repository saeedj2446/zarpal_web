
interface OtpTimerProps {
    totalTime: number;       // کل زمان OTP بر حسب ثانیه
    currentSeconds: number;  // مقدار فعلی ثانیه
    size?: number;
    emptyColor?: string;// قطر دایره به پیکسل (اختیاری)
    fillColor?: string;
    textColor?: string;
}

export default function Timer({
                                  totalTime=120,
                                  currentSeconds,
                                  size = 100,
                                  emptyColor="#e896b7",
                                  fillColor="white",
                                  textColor = "#555",
                              }: OtpTimerProps) {
    if (currentSeconds <= 0) return null;

    const radius = size / 2;
    const stroke = size * 0.1; // ضخامت تقریبی نسبت به سایز
    const normalizedRadius = radius - stroke;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset =
        circumference - (currentSeconds / totalTime) * circumference;

    return (
        <div className="flex flex-col items-center justify-center">
            <svg height={size} width={size}>
                <circle
                    stroke={emptyColor}
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke={fillColor}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={`${circumference} ${circumference}`}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    transform={`rotate(-90 ${radius} ${radius})`}
                />
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy="0.3em"
                    fontSize={size * 0.25} // اندازه متن نسبت به سایز دایره
                    fill={textColor}
                    fontWeight="bold"
                >
                    {currentSeconds}
                </text>
            </svg>
        </div>
    );
}
