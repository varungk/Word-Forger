import React, { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';

const words = ['Email', 'Scripts', 'Tweets', 'and many more..'];

const AnimatedWord = () => { 
    return (
        <>
        <div className='pt-5'>
            <TypeAnimation className='lg:text-6xl md:text-4xl text-3xl text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-orange-800 font-bold'
                sequence={[
                    'Emails',
                    1000,
                    'Scripts',
                    1000,
                    'Tweets',
                    1000,
                    "Profile bio's",
                    1000,
                    "Blog posts",
                    1000,
                    'and many more..',
                    1000,
                ]}
                wrapper="span"
                speed={10}
                style={{ fontSize: '2em', display: 'inline-block' }}
                repeat={Infinity}
            />
        </div>
        </>
    );
};

export default AnimatedWord;
