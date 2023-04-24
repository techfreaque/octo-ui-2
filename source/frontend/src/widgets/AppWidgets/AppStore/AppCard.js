import { Card, Switch, Col, Row } from 'antd';
import { useState } from 'react';
import './style.css';
import AntButton from '../../../components/Buttons/AntButton';

const { Meta } = Card;

export default function AppCard({app}) {
    const [showDb, setShowDb] = useState(false);
    const mouseHover = () => setShowDb(prev => !prev);
    const category = app.categories.length > 1 ? 'Package' : app.categories[0]
;
    return (
    <>
    <Col 
        // xs={{span:12, offset:1}} md={{span:6,offset:1}} lg={{span:4 ,offset:1}}
        >
        <Card className='productCard'
            hoverable
            cover={<img className="productCard__image" alt="example" src='https://tradeciety.com/hubfs/Imported_Blog_Media/GBPUSDH45.png' />}
            onMouseEnter={mouseHover} 
            onMouseLeave={mouseHover}>
                <div>
                    <Meta 
                        title={<div className='productCard__title'>{app.title}</div>}
                        description={[
                            <div className='productCard__category'>
                                {category}
                            </div>,
                            <RatingComponent rating={app.rating} votes={app.votes} />,

                            <div className='productCard__description'>
                                {app.description}
                            </div>
                        ]}
                    />
                    <div key="productCardPrice" className='productCard__price'>
                        {showDb && <AntButton buttonVariant="text">
                        {app.price ? `Buy for ${app.price}$` : 'Free download' } </AntButton>} 
                        {!showDb && (app.price ? app.price+"$":undefined)}
                    </div>
                </div>
        </Card>
    </Col>
    </>
    );
};

function RatingComponent(props) {
    const formatCash = n => {
        if (n < 1e3) return n.toString();
        if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(2) + "K";
        if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(2) + "M";
        if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(2) + "B";
        if (n >= 1e12) return +(n / 1e12).toFixed(2) + "T";
    };
    const rating = formatCash(props.rating);
  
    return (
      <div className="ratingComponent">
        {rating >= 1 ? <FullStar /> : rating >= 0.5 ? <HalfStar /> : <EmptyStar />}
        {rating >= 2 ? <FullStar /> : rating >= 1.5 ? <HalfStar /> : <EmptyStar />}
        {rating >= 3 ? <FullStar /> : rating >= 2.5 ? <HalfStar /> : <EmptyStar />}
        {rating >= 4 ? <FullStar /> : rating >= 3.5 ? <HalfStar /> : <EmptyStar />}
        {rating >= 5 ? <FullStar /> : rating >= 4.5 ? <HalfStar /> : <EmptyStar />}
        <span className='ratingComponent__votes'>{props.votes}</span>
      </div>
    );
  }

function FullStar() {
    return (
        <svg width="14" height="14" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="fullStar">
            <path d="M 9.5 14.25 l -5.584 2.936 l 1.066 -6.218 L 0.465 6.564 l 6.243 -0.907 L 9.5 0 l 2.792 5.657 l 6.243 0.907 l -4.517 4.404 l 1.066 6.218 L 9.5 14.25">
            </path>
        </svg>
    )
}

function HalfStar() {
    return (
    <svg width="14" height="14" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="halfStar">
        <path d="M 9.5 14.25 l -5.584 2.936 l 1.066 -6.218 L 0.465 6.564 l 6.243 -0.907 L 9.5 0 l 2.792 5.657 l 6.243 0.907 l -4.517 4.404 l 1.066 6.218 L 9.5 14.25">
        </path>
        <path d="M 9.5 14.25 l -5.584 2.936 l 1.066 -6.218 L 0.465 6.564 l 6.243 -0.907 L 9.5 0 l 0 0">
        </path>
    </svg>
    )
}

function EmptyStar() {
    return (
    <svg width="14" height="14" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="emptyStar">
        <path d="M 9.5 14.25 l -5.584 2.936 l 1.066 -6.218 L 0.465 6.564 l 6.243 -0.907 L 9.5 0 l 2.792 5.657 l 6.243 0.907 l -4.517 4.404 l 1.066 6.218 L 9.5 14.25">
        </path>
    </svg>
    )
}
