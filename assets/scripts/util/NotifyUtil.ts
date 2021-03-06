import * as _ from "lodash";
import BaseSingleton from "../base/BaseSingeton";
import { ENotifyType } from "../Enum";

type NotifyFn = (userData: unknown, notifyType?: ENotifyType) => void;

interface IObserver {
    func: NotifyFn;
    target: unknown;
}

/**
 * 全局事件
 *
 * @export
 * @class NotifyUtil
 */
export default class NotifyUtil extends BaseSingleton {

    private observerMap: Map<ENotifyType, IObserver[]> = new Map();

    private constructor() {
        super();
        // 检查 ENotifyType 拼写, 并初始化 observerMap
        for (const key in ENotifyType) {
            if (Object.prototype.hasOwnProperty.call(ENotifyType, key)) {
                const notifyName = ENotifyType[key];
                if (notifyName !== key) {
                    throw new Error(`Definition Error ${key} -> ${notifyName}`);
                }
                this.observerMap.set(notifyName, []);
            }
        }
    }

    public async setup() {
        console.log("NotifyUtil setup");
    }

    /**
     * 注册事件
     *
     * @param notifyType
     * @param notifyFunc
     * @param target
     * @memberof NotifyUtil
     */
    public on(notifyType: ENotifyType, notifyFunc: NotifyFn, target: unknown) {
        this.observerMap.get(notifyType).push({ func: notifyFunc, target: target });
    }

    /**
     * 移除事件
     *
     * @param notifyType
     * @param notifyFunc
     * @param target
     * @memberof NotifyUtil
     */
    public off(notifyType: ENotifyType, notifyFunc: NotifyFn, target: unknown) {
        _.remove(this.observerMap.get(notifyType), (o) => o.func === notifyFunc && o.target === target);
    }

    /**
     * 发射事件
     *
     * @template T
     * @param notifyType
     * @param [userData=null]
     * @memberof NotifyUtil
     */
    public emit<T extends unknown>(notifyType: ENotifyType, userData: T = null) {
        this.observerMap.get(notifyType).forEach((obs: IObserver) => {
            if (obs.target) {
                obs.func.call(obs.target, userData, notifyType);
            } else {
                obs.func(userData, notifyType);
            }
        });
    }
}
