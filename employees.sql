-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-01-2021 a las 02:45:39
-- Versión del servidor: 10.4.10-MariaDB
-- Versión de PHP: 7.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `employees`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `department`
--

CREATE TABLE `department` (
  `id` int(11) NOT NULL,
  `name` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `department`
--

INSERT INTO `department` (`id`, `name`) VALUES
(1, 'Gerency'),
(2, 'Engineering Dept'),
(5, 'Dept 2'),
(6, 'new dept 3'),
(7, 'new dept 4'),
(8, 'Test 5'),
(9, 'Test dept updated'),
(10, 'Dept Two'),
(11, 'Test Dep');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `employee`
--

INSERT INTO `employee` (`id`, `first_name`, `last_name`, `role_id`, `manager_id`) VALUES
(1, 'CEO', '', 1, 0),
(2, 'Luis Fernando', 'Contreras Marin', 5, 10),
(3, 'Martin', 'Contreras', 1, 1),
(4, 'Barbara', 'Marin', 3, 1),
(5, 'Manager', 'One', 1, 1),
(6, 'Tester', 'One', 4, 3),
(9, 'Tester ', '10', 5, 3),
(10, 'Manager', 'test', 1, 1),
(11, 'New Tester Updated', 'Last Name', 5, 3),
(12, 'Employee', 'Test', 5, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `title` varchar(30) DEFAULT NULL,
  `salary` decimal(10,0) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `role`
--

INSERT INTO `role` (`id`, `title`, `salary`, `department_id`) VALUES
(1, 'Manager', '150000', 1),
(2, 'New Test Updated', '10000', 9),
(3, 'Test 2', '1000000', 7),
(4, 'Test 4', '5000', 2),
(5, 'Update Test', '1000', 10);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indices de la tabla `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dept_id` (`department_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `department`
--
ALTER TABLE `department`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Filtros para la tabla `role`
--
ALTER TABLE `role`
  ADD CONSTRAINT `dept_id` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
