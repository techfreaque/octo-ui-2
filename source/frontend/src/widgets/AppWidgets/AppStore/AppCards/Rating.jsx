export default function RatingComponent({rating, votes}) {
    // const formatCash = n => {
    //     if (n < 1e3)
    //         return n.toString();

    //     if (n >= 1e3 && n < 1e6)
    //         return + (n / 1e3).toFixed(2) + "K";

    //     if (n >= 1e6 && n < 1e9)
    //         return + (n / 1e6).toFixed(2) + "M";

    //     if (n >= 1e9 && n < 1e12)
    //         return + (n / 1e9).toFixed(2) + "B";

    //     if (n >= 1e12)
    //         return + (n / 1e12).toFixed(2) + "T";

    // };
    // const _rating = formatCash(rating);
    return (
        <div style={
            {
                marginTop: "5px",
                marginBottom: "5px",
                display: "flex",
                alignItems: "center",
                fontSize: "12px",
                lineHeight: "16px"
            }
        }>
            {
            [
                1,
                2,
                3,
                4,
                5
            ].map(starId => (
                <Rating rating={rating}
                    starId={starId}/>
            ))
        }
            <span className='ratingComponent__votes'>
                {votes}</span>
        </div>
    );
}


function Rating({rating, starId}) {
    if (rating >= starId) {
        return (
            <FullStar/>)
    } else if (rating >= starId + .5) {
        (
            <HalfStar/>)
    } else {
        return (
            <EmptyStar/>)

    }
}
function FullStar() {
    return (
        <svg width="14" height="14" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="fullStar">
            <path d="M 9.5 14.25 l -5.584 2.936 l 1.066 -6.218 L 0.465 6.564 l 6.243 -0.907 L 9.5 0 l 2.792 5.657 l 6.243 0.907 l -4.517 4.404 l 1.066 6.218 L 9.5 14.25"></path>
        </svg>
    )
}

function HalfStar() {
    return (
        <svg width="14" height="14" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="halfStar">
            <path d="M 9.5 14.25 l -5.584 2.936 l 1.066 -6.218 L 0.465 6.564 l 6.243 -0.907 L 9.5 0 l 2.792 5.657 l 6.243 0.907 l -4.517 4.404 l 1.066 6.218 L 9.5 14.25"></path>
            <path d="M 9.5 14.25 l -5.584 2.936 l 1.066 -6.218 L 0.465 6.564 l 6.243 -0.907 L 9.5 0 l 0 0"></path>
        </svg>
    )
}

function EmptyStar() {
    return (
        <svg width="14" height="14" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="emptyStar">
            <path d="M 9.5 14.25 l -5.584 2.936 l 1.066 -6.218 L 0.465 6.564 l 6.243 -0.907 L 9.5 0 l 2.792 5.657 l 6.243 0.907 l -4.517 4.404 l 1.066 6.218 L 9.5 14.25"></path>
        </svg>
    )
}
