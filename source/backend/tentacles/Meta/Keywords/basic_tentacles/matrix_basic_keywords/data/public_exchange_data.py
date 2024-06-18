import typing
import numpy
from tentacles.Meta.Keywords.basic_tentacles.matrix_basic_keywords.matrix_enums import (
    PriceDataSources,
)

import tentacles.Meta.Keywords.basic_tentacles.matrix_basic_keywords.user_inputs2 as user_inputs2
import tentacles.Meta.Keywords.basic_tentacles.matrix_basic_keywords.tools.utilities as utilities
import tentacles.Meta.Keywords.scripting_library.data.reading.exchange_public_data as exchange_public_data


async def user_select_candle_source_name(
    maker,
    indicator,
    name="Select Candle Source",
    def_val=PriceDataSources.CLOSE.value,
    enable_volume=False,
    show_in_summary=False,
    show_in_optimizer=False,
    order=None,
):
    available_data_src = [
        PriceDataSources.OPEN.value,
        PriceDataSources.HIGH.value,
        PriceDataSources.LOW.value,
        PriceDataSources.CLOSE.value,
        PriceDataSources.HL2.value,
        PriceDataSources.HLC3.value,
        PriceDataSources.OHLC4.value,
        PriceDataSources.HEIKIN_ASHI_OPEN.value,
        PriceDataSources.HEIKIN_ASHI_HIGH.value,
        PriceDataSources.HEIKIN_ASHI_LOW.value,
        PriceDataSources.HEIKIN_ASHI_CLOSE.value,
    ]
    if enable_volume:
        available_data_src.append(PriceDataSources.VOLUME.value)

    source_name = await user_inputs2.user_input2(
        maker,
        indicator,
        name,
        "options",
        def_val,
        options=available_data_src,
        show_in_summary=show_in_summary,
        show_in_optimizer=show_in_optimizer,
        order=order,
    )
    return source_name


async def get_candles_(
    maker, source_name=PriceDataSources.CLOSE.value, time_frame=None, symbol=None
):
    symbol = symbol or maker.ctx.symbol
    time_frame = (
        time_frame
        or (
            maker.current_indicator_time_frame
            if hasattr(maker, "current_indicator_time_frame")
            else None
        )
        or maker.ctx.time_frame
    )
    try:
        if maker.ctx.exchange_manager.is_backtesting:
            return maker.candles[symbol][time_frame][source_name]
    except KeyError:
        pass
    sm_time = utilities.start_measure_time()
    if symbol not in maker.candles:
        maker.candles[symbol] = {}
    if time_frame not in maker.candles[symbol]:
        maker.candles[symbol][time_frame] = {}
    maker.candles[symbol][time_frame][source_name] = await get_candles_from_name(
        maker,
        source_name=source_name,
        time_frame=time_frame,
        symbol=symbol,
        max_history=True,
    )
    utilities.end_measure_time(
        sm_time,
        f" strategy maker - loading candle: {source_name}, {symbol}, {time_frame}",
        min_duration=1,
    )
    return maker.candles[symbol][time_frame][source_name]


async def get_candle_from_time(
    maker,
    timestamp: typing.Union[int, float],
    source_name: str = PriceDataSources.CLOSE.value,
    time_frame: typing.Optional[str] = None,
    symbol: typing.Optional[str] = None,
):
    times = await get_candles_(
        maker,
        source_name=PriceDataSources.TIME.value,
        time_frame=time_frame,
        symbol=symbol,
    )
    candles = await get_candles_(
        maker, source_name=source_name, time_frame=time_frame, symbol=symbol
    )
    try:
        if isinstance(candles, numpy.ndarray):
            current_index = numpy.where(numpy.isclose(times, timestamp))[0][0]
        else:
            current_index = times.index(timestamp)
    except (ValueError, KeyError, IndexError) as error:
        raise ValueError(
            f"No price for candle {source_name} (time: {timestamp} - "
            f"{symbol} - {time_frame})"
        ) from error
    return candles[current_index]


async def get_current_candle(
    maker, source_name=PriceDataSources.CLOSE.value, time_frame=None, symbol=None
) -> float:
    symbol = symbol or maker.ctx.symbol
    time_frame = time_frame or maker.ctx.time_frame
    if maker.ctx.exchange_manager.is_backtesting:
        return await get_candle_from_time(
            maker=maker,
            timestamp=maker.ctx.trigger_value[0],
            source_name=source_name,
            time_frame=time_frame,
            symbol=symbol,
        )
    if source_name == PriceDataSources.CLOSE.value:
        return await exchange_public_data.current_candle_price(
            maker.ctx, symbol=symbol, time_frame=time_frame
        )
    if source_name == PriceDataSources.LIVE.value:
        return await exchange_public_data.current_live_price(maker.ctx, symbol=symbol)


async def get_candles_from_name(
    maker, source_name, time_frame, symbol, max_history=True
):
    symbol = symbol or maker.ctx.symbol
    time_frame = time_frame or maker.ctx.time_frame

    if source_name == PriceDataSources.CLOSE.value:
        return await exchange_public_data.Close(
            maker.ctx,
            symbol=symbol,
            time_frame=time_frame,
            limit=-1,
            max_history=max_history,
        )
    if source_name == PriceDataSources.OPEN.value:
        return await exchange_public_data.Open(
            maker.ctx,
            symbol=symbol,
            time_frame=time_frame,
            limit=-1,
            max_history=max_history,
        )
    if source_name == PriceDataSources.HIGH.value:
        return await exchange_public_data.High(
            maker.ctx,
            symbol=symbol,
            time_frame=time_frame,
            limit=-1,
            max_history=max_history,
        )
    if source_name == PriceDataSources.LOW.value:
        return await exchange_public_data.Low(
            maker.ctx,
            symbol=symbol,
            time_frame=time_frame,
            limit=-1,
            max_history=max_history,
        )
    if source_name == PriceDataSources.VOLUME.value:
        return await exchange_public_data.Volume(
            maker.ctx,
            symbol=symbol,
            time_frame=time_frame,
            limit=-1,
            max_history=max_history,
        )
    if source_name == PriceDataSources.TIME.value:
        return await exchange_public_data.Time(
            maker.ctx,
            symbol=symbol,
            time_frame=time_frame,
            limit=-1,
            max_history=max_history,
        )
    if source_name == PriceDataSources.HL2.value:
        try:
            from tentacles.Evaluator.Util.candles_util import CandlesUtil

            return CandlesUtil.HL2(
                await get_candles_(
                    maker,
                    source_name=PriceDataSources.HIGH.value,
                    time_frame=time_frame,
                    symbol=symbol,
                ),
                await get_candles_(
                    maker,
                    source_name=PriceDataSources.LOW.value,
                    time_frame=time_frame,
                    symbol=symbol,
                ),
            )
        except ImportError as error:
            raise RuntimeError("CandlesUtil tentacle is required to use HL2") from error
    if source_name == PriceDataSources.HLC3.value:
        try:
            from tentacles.Evaluator.Util.candles_util import CandlesUtil

            return CandlesUtil.HLC3(
                await get_candles_(
                    maker,
                    source_name=PriceDataSources.HIGH.value,
                    time_frame=time_frame,
                    symbol=symbol,
                ),
                await get_candles_(
                    maker,
                    source_name=PriceDataSources.LOW.value,
                    time_frame=time_frame,
                    symbol=symbol,
                ),
                await get_candles_(
                    maker,
                    source_name=PriceDataSources.CLOSE.value,
                    time_frame=time_frame,
                    symbol=symbol,
                ),
            )
        except ImportError as error:
            raise RuntimeError(
                "CandlesUtil tentacle is required to use HLC3"
            ) from error
    if source_name == PriceDataSources.OHLC4.value:
        try:
            from tentacles.Evaluator.Util.candles_util import CandlesUtil

            return CandlesUtil.OHLC4(
                await get_candles_(
                    maker,
                    source_name=PriceDataSources.OPEN.value,
                    time_frame=time_frame,
                    symbol=symbol,
                ),
                await get_candles_(
                    maker,
                    source_name=PriceDataSources.HIGH.value,
                    time_frame=time_frame,
                    symbol=symbol,
                ),
                await get_candles_(
                    maker,
                    source_name=PriceDataSources.LOW.value,
                    time_frame=time_frame,
                    symbol=symbol,
                ),
                await get_candles_(
                    maker,
                    source_name=PriceDataSources.CLOSE.value,
                    time_frame=time_frame,
                    symbol=symbol,
                ),
            )
        except ImportError as error:
            raise RuntimeError(
                "CandlesUtil tentacle is required to use OHLC4"
            ) from error
    if "Heikin Ashi" in source_name:
        try:
            from tentacles.Evaluator.Util.candles_util import CandlesUtil

            haOpen, haHigh, haLow, haClose = CandlesUtil.HeikinAshi(
                await get_candles_(
                    maker,
                    source_name=PriceDataSources.OPEN.value,
                    time_frame=time_frame,
                    symbol=symbol,
                ),
                await get_candles_(
                    maker,
                    source_name=PriceDataSources.HIGH.value,
                    time_frame=time_frame,
                    symbol=symbol,
                ),
                await get_candles_(
                    maker,
                    source_name=PriceDataSources.LOW.value,
                    time_frame=time_frame,
                    symbol=symbol,
                ),
                await get_candles_(
                    maker,
                    source_name=PriceDataSources.CLOSE.value,
                    time_frame=time_frame,
                    symbol=symbol,
                ),
            )
            maker.candles[symbol][time_frame][
                PriceDataSources.HEIKIN_ASHI_OPEN.value
            ] = haOpen
            maker.candles[symbol][time_frame][
                PriceDataSources.HEIKIN_ASHI_HIGH.value
            ] = haHigh
            maker.candles[symbol][time_frame][
                PriceDataSources.HEIKIN_ASHI_LOW.value
            ] = haLow
            maker.candles[symbol][time_frame][
                PriceDataSources.HEIKIN_ASHI_CLOSE.value
            ] = haClose
            if source_name == PriceDataSources.HEIKIN_ASHI_CLOSE.value:
                return haClose
            if source_name == PriceDataSources.HEIKIN_ASHI_OPEN.value:
                return haOpen
            if source_name == PriceDataSources.HEIKIN_ASHI_HIGH.value:
                return haHigh
            if source_name == PriceDataSources.HEIKIN_ASHI_LOW.value:
                return haLow
        except ImportError as error:
            raise RuntimeError(
                "CandlesUtil tentacle is required to use Heikin Ashi"
            ) from error


# async def _load_backtesting_candles_manager(
#     exchange_manager,
#     symbol: str,
#     time_frame: str,
# ) -> exchange_data.CandlesManager:
#     start_time = backtesting_api.get_backtesting_starting_time(
#         exchange_manager.exchange.backtesting
#     )
#     end_time = backtesting_api.get_backtesting_ending_time(
#         exchange_manager.exchange.backtesting
#     )
#     ohlcv_data: list = await exchange_manager.exchange.exchange_importers[0].get_ohlcv(
#         exchange_name=exchange_manager.exchange_name,
#         symbol=symbol,
#         time_frame=commons_enums.TimeFrames(time_frame),
#     )
#     chronological_candles: list = sorted(ohlcv_data, key=lambda candle: candle[0])
#     full_candles_history = [
#         ohlcv[-1]
#         for ohlcv in chronological_candles
#         if start_time <= ohlcv[0] <= end_time
#     ]
#     candles_manager = exchange_data.CandlesManager(
#         max_candles_count=len(full_candles_history)
#     )
#     await candles_manager.initialize()
#     candles_manager.replace_all_candles(full_candles_history)
#     return candles_manager


# async def _load_candles_manager(
#     context, symbol: str, time_frame: str, max_history: bool = False
# ) -> exchange_data.CandlesManager:
#     if max_history and context.exchange_manager.is_backtesting:
#         return await _load_backtesting_candles_manager(
#             context.exchange_manager,
#             symbol,
#             time_frame,
#         )
#     return trading_api.get_symbol_candles_manager(
#         trading_api.get_symbol_data(
#             context.exchange_manager, symbol, allow_creation=False
#         ),
#         time_frame,
#     )
