import { Rate } from "antd";
import { useRateAppStore } from "../../../../context/data/AppStoreDataProvider";
import { useState } from "react";

export default function AppRating({app, rating, votes, style}) {
    const formatCash = n => {
        if (!n) return 0;
        if (n < 1e3)
            return n.toString();

        if (n >= 1e3 && n < 1e6)
            return `${+ (n / 1e3).toFixed(2)}K`;

        if (n >= 1e6 && n < 1e9)
            return `${+ (n / 1e6).toFixed(2)}M`;

        if (n >= 1e9 && n < 1e12)
            return `${+ (n / 1e9).toFixed(2)}B`;

        if (n >= 1e12)
            return `${+ (n / 1e12).toFixed(2)}T`;

    };
    const votes_ = formatCash(votes);
    const [, setIsloading] = useState(false)

    const rateAppStore = useRateAppStore()
    async function onRatingChange(starId) { // TODO use rating endpoint here
        rateAppStore({ rating: starId + 1, package_id: app.package_id }, setIsloading)
    }
    return (
        <div style={
            {
                marginTop: "5px",
                marginBottom: "5px",
                display: "flex",
                alignItems: "center",
                fontSize: "12px",
                lineHeight: "16px",
                ...style
            }
        }>
            <Rate allowHalf 
                defaultValue={0}
                value={rating}
                disabled={!app.is_installed}
                style={{color:'rgb(185, 179, 169)',
                    fontSize:'14px',
                }}
                onChange={onRatingChange} />
            <span className='ratingComponent__votes'>
                {votes_}</span>
        </div>
    );
}


// function Rating({ rating, starId, onRatingChange }) {
//     const starStyle = {
//         cursor: "pointer"
//     }
//     if (rating >= starId+1) {
//         return (
//             <FullStar onRatingChange={onRatingChange} starStyle={starStyle} />)
//     } else if (rating >= starId + .5) {
//         return (
//             <HalfStar onRatingChange={onRatingChange} starStyle={starStyle} />)
//     } else {
//         return (
//             <EmptyStar onRatingChange={onRatingChange} starStyle={starStyle} />)

//     }
// }
// function FullStar({onRatingChange, starStyle}) {
//     return (
//         <svg onClick={onRatingChange} style={starStyle} width="14" height="14" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="fullStar">
//             <path d="M 9.5 14.25 l -5.584 2.936 l 1.066 -6.218 L 0.465 6.564 l 6.243 -0.907 L 9.5 0 l 2.792 5.657 l 6.243 0.907 l -4.517 4.404 l 1.066 6.218 L 9.5 14.25"></path>
//         </svg>
//     )
// }

// function HalfStar({onRatingChange, starStyle}) {
//     return (
//         <svg onClick={onRatingChange} style={starStyle} width="14" height="14" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="halfStar">
//             <path d="M 9.5 14.25 l -5.584 2.936 l 1.066 -6.218 L 0.465 6.564 l 6.243 -0.907 L 9.5 0 l 2.792 5.657 l 6.243 0.907 l -4.517 4.404 l 1.066 6.218 L 9.5 14.25"></path>
//             <path d="M 9.5 14.25 l -5.584 2.936 l 1.066 -6.218 L 0.465 6.564 l 6.243 -0.907 L 9.5 0 l 0 0"></path>
//         </svg>
//     )
// }

// function EmptyStar({onRatingChange, starStyle}) {
//     return (
//         <svg onClick={onRatingChange} style={starStyle} width="14" height="14" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="emptyStar">
//             <path d="M 9.5 14.25 l -5.584 2.936 l 1.066 -6.218 L 0.465 6.564 l 6.243 -0.907 L 9.5 0 l 2.792 5.657 l 6.243 0.907 l -4.517 4.404 l 1.066 6.218 L 9.5 14.25"></path>
//         </svg>
//     )
// }
