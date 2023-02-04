import React, { useState } from "react";
import { MathComponent } from 'mathjax-react';
import clsx from 'clsx';
import { useEvent } from '@zhongbr/react-hooks';

import { Icon } from '@/components';

import Hover from '../Hover';
import styles from './jax.module.less';
import {copy} from "@/utils/copy";

type IMathComponentProps = typeof MathComponent extends React.FC<infer T> ? T : unknown;
export type IProps = IMathComponentProps & {
    className?: string;
};

const MathJax: React.FC<IProps> = props => {
    const { className, ...others } = props;

    const [copied, setCopied] = useState(false);

    const onCopy = useEvent(() => {
        setCopied(true);
        copy(others.tex || '');
    });

    return (
        <Hover
            className={className}
            hoverContent={(
                <div className={clsx(styles.hover, 'blur')}>
                    <span onClick={onCopy} className={styles.content}>
                        {copied ? (
                            <>
                                <Icon className="rp-xuanxiang" />
                                LaTex Copied
                            </>
                            ) : (
                            <>
                                <Icon className="rp-fuzhi"/>
                                Copy LaTex
                            </>
                        )}
                    </span>
                </div>
            )}
        >
            <MathComponent {...others} />
        </Hover>
    )
};

MathJax.displayName = 'MathJax';
export default MathJax;
