package com.spring_react.spring_react.bookregister;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BookImageMapper {

    void insertBookImage(
            @Param("imageId") String imageId,
            @Param("bookId") Integer bookId,
            @Param("imageUrl") String imageUrl,
            @Param("isThumbnail") boolean isThumbnail
    );
}
