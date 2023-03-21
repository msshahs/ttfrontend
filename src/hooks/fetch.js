import React, { useEffect, useState } from 'react'

export const useFetch = (url, method, body) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [isError, setIsError] = useState(false)
    const [renderKey, setRenderKey] = useState(0)

    const refetch = () => setRenderKey(Math.random())

    useEffect(() => {
        fetch(url,{
          method:method,
          body:body
        })
      .then((response) => response.json())
      .then((data) => setData(data.data)).catch((err) => setIsError(true)).finally(() => setLoading(false));
    }, [renderKey])

    return {data, loading, isError, refetch}
}

