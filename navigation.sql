-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2022-05-05 19:28:48
-- 服务器版本： 5.7.37-log
-- PHP 版本： 7.4.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `navigation`
--

-- --------------------------------------------------------

--
-- 表的结构 `category`
--

CREATE TABLE `category` (
  `_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `repos` json NOT NULL,
  `uid` int(11) DEFAULT NULL,
  `cid` int(11) NOT NULL,
  `createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 转存表中的数据 `category`
--

INSERT INTO `category` (`_id`, `name`, `repos`, `uid`, `cid`, `createAt`, `updateAt`) VALUES
(1, '23333333', '[{\"full_name\": \"Dye/lanstar4\"}, {\"full_name\": \"Dye/lanstar2\"}]', 1, 2, '2022-05-02 19:51:55', '2022-05-05 14:58:28'),
(6, '未分类', '[{\"full_name\": \"Dye/lanstar4\"}, {\"full_name\": \"Dye/lanstar1\"}]', 1, 1, '2022-05-03 20:18:20', '2022-05-05 15:27:32'),
(9, '2333', '[{\"full_name\": \"Dye/lanstar3\"}, {\"full_name\": \"Dye/lanstar211\"}, {\"full_name\": \"Dye/lanstar1\"}, {\"full_name\": \"Dye/lanstar3\"}, {\"full_name\": \"Dye/lanstar2\"}, {\"full_name\": \"Dye/lanstar1\"}, {\"full_name\": \"Dye/lanstar3\"}, {\"full_name\": \"Dye/lanstar4\"}]', 1, 0, '2022-05-05 08:05:34', '2022-05-05 15:27:32'),
(11, '未分类', '[{\"full_name\": \"Dye/lanqiao-competition-code\"}, {\"full_name\": \"Dye/lanstar\"}]', 1, 2, '2022-05-05 15:12:17', '2022-05-05 15:12:17'),
(13, '未分类', '[{\"full_name\": \"Dye/lanqiao-competition-code\"}, {\"full_name\": \"Dye/lanstar\"}]', 1, 12, '2022-05-05 15:33:58', '2022-05-05 15:33:58');

-- --------------------------------------------------------

--
-- 表的结构 `repo`
--

CREATE TABLE `repo` (
  `_id` int(11) NOT NULL,
  `repoName` varchar(255) NOT NULL,
  `createAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `gitee_id` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `categories` int(8) NOT NULL DEFAULT '0',
  `gitee_token` varchar(255) DEFAULT NULL,
  `gitee_refresh_token` varchar(255) DEFAULT NULL,
  `createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`_id`, `username`, `password`, `gitee_id`, `email`, `categories`, `gitee_token`, `gitee_refresh_token`, `createAt`, `updateAt`) VALUES
(1, 'dyedd', 'e10adc3949ba59abbe56e057f20f883e', '1197298', '1234@qq.com', 3, '45d0645cb31d1542bb211fdf5f6631c3', 'fe14a20fc9a61d55a8f37db80998d8a2694a76bc096c8eb25bdca1f8716e8d36', '2022-05-02 19:38:26', '2022-05-05 15:27:16'),
(2, 'test111', 'e10adc3949ba59abbe56e057f20f883e', NULL, '1111@qq.com', 0, NULL, NULL, '2022-05-05 08:40:37', '2022-05-05 08:40:37'),
(3, 'dyedd123', 'e10adc3949ba59abbe56e057f20f883e', NULL, '1234@qq.com', 0, NULL, NULL, '2022-05-05 08:41:40', '2022-05-05 08:41:40');

--
-- 转储表的索引
--

--
-- 表的索引 `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`_id`),
  ADD KEY `fk_uid` (`uid`);

--
-- 表的索引 `repo`
--
ALTER TABLE `repo`
  ADD PRIMARY KEY (`_id`);

--
-- 表的索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`_id`),
  ADD UNIQUE KEY `github_id` (`gitee_id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `category`
--
ALTER TABLE `category`
  MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- 使用表AUTO_INCREMENT `repo`
--
ALTER TABLE `repo`
  MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 限制导出的表
--

--
-- 限制表 `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `fk_uid` FOREIGN KEY (`uid`) REFERENCES `user` (`_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
