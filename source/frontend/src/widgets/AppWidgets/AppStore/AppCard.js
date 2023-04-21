import { Card, Skeleton, Switch, Col, Row } from 'antd';
import { useState } from 'react';
import './style.css';
import AntButton from '../../../components/Buttons/AntButton';
const { Meta } = Card;

export default function AppCard({app}) {
    const [showDb, setShowDb] = useState(false);
    const mouseHover = () => setShowDb(prev => !prev);
;
    return (
    <>
    <Col 
        // xs={{span:12, offset:1}} md={{span:6,offset:1}} lg={{span:4 ,offset:1}}
        >
        <Card className='productCard'
            hoverable
            cover={<img alt="example" src='https://tradeciety.com/hubfs/Imported_Blog_Media/GBPUSDH45.png' />}
            onMouseEnter={mouseHover} 
            onMouseLeave={mouseHover}>
                <div>
                    <Meta 
                        title={app.title} 
                        description={app.description}
                    />
                    <div className='productCard__price'
                        >
                        {showDb && <AntButton buttonVariant="text"> Download </AntButton>} 
                        {!showDb && app.price}
                    </div>
                </div>
        </Card>
    </Col>
    </>
    );
};
